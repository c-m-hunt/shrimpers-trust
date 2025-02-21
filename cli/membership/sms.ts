import process from "node:process";

import * as api from "./clicksend.ts";

import { logger } from "../lib/utils/index.ts";

import { readCSV } from "https://deno.land/x/csv@v0.9.1/mod.ts";

type Member = {
  membershipNo: string;
  firstName: string;
  lastName: string;
  mobileNo: string;
  expiryDate: string;
};

export const sendMemberReminders = async () => {
  const clicksendUser = process.env.CLICKSEND_USERNAME;
  const clicksendKey = process.env.CLICKSEND_API_KEY;

  if (!clicksendUser || !clicksendKey) {
    logger.error("No ClickSend username or API key provided");
    return;
  }

  const smsApi = new api.SMSApi(clicksendUser, clicksendKey);

  const smsCollection = new api.SmsMessageCollection();

  smsCollection.messages = [];

  const currentDir = new URL(".", import.meta.url).pathname;
  const filePath = `${currentDir}../../member-report/data/renewals.csv`;

  const renewalList = await getRenewalList(filePath);

  for (const member of renewalList) {
    const message = `Hi ${member.firstName}
Membership No. ${member.membershipNo}

Your Shrimpers Trust membership has now expired

It would be great to have you back!

Maybe consider a life membership so you never have to renew again!  :-)

Renew here - https://www.shrimperstrust.co.uk/renewal`;
    const smsMessage = getMemberReminder(member.mobileNo, message);
    smsCollection.messages.push(smsMessage);
  }

  logger.info("Sending SMS");

  try {
    const response = await smsApi.smsSendPost(smsCollection, {
      shortenUrls: true,
    });
    logger.info("SMS sent");
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const getMemberReminder = (to: string, body: string) => {
  const smsMessage = new api.SmsMessage();

  smsMessage.from = "myNumber";
  smsMessage.to = to;
  smsMessage.body = body;

  // Schedule
  //   smsMessage.schedule = 1740160800;

  return smsMessage;
};

const getRenewalList = async (filePath: string): Promise<Member[]> => {
  const file = await Deno.open(filePath);
  const members: Member[] = [];

  for await (const row of readCSV(file)) {
    let data: string[] = [];
    for await (const cell of row) {
      data = [...data, cell];
    }
    const member: Member = {
      membershipNo: data[0],
      firstName: data[1],
      lastName: data[2],
      mobileNo: data[3],
      expiryDate: data[4],
    };
    members.push(member);
  }

  file.close();
  return members;
};
