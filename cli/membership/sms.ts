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

export const sendSMS = async (smsCollection: api.SmsMessageCollection) => {
  const clicksendUser = process.env.CLICKSEND_USERNAME;
  const clicksendKey = process.env.CLICKSEND_API_KEY;

  if (!clicksendUser || !clicksendKey) {
    logger.error("No ClickSend username or API key provided");
    return;
  }

  const smsApi = new api.SMSApi(clicksendUser, clicksendKey);

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

export const sendMemberReminders = async () => {
  const currentDir = new URL(".", import.meta.url).pathname;
  const filePath = `${currentDir}../../member-report/data/renewals.csv`;

  const renewalList = await getMemberList(filePath);

  const smsCollection = new api.SmsMessageCollection();
  smsCollection.messages = [];

  for (const member of renewalList) {
    const message = `Hi ${member.firstName}
Membership No. ${member.membershipNo}

Your Shrimpers Trust membership has now expired

It would be great to have you back!

Maybe consider a life membership so you never have to renew again!  :-)

Renew here - https://www.shrimperstrust.co.uk/renewal`;
    const smsMessage = getSMSMessage(member.mobileNo, message);
    smsCollection.messages.push(smsMessage);
  }

  await sendSMS(smsCollection);
};

export const sendCoachSMS = async () => {
  const currentDir = new URL(".", import.meta.url).pathname;
  const filePath = `${currentDir}../../member-report/data/coaches.csv`;

  const coachList = await getMemberList(filePath);

  const smsCollection = new api.SmsMessageCollection();
  smsCollection.messages = [];

  for (const member of coachList) {
    const message = `Hi ${member.firstName}

Shrimpers Trust Rochdale Coach

We have had to change the departure times for the coach to Rochdale on Thursday 15th May.
ROOTS HALL - 12.00
THE ELMS - 12.10
HADLEIGH CHURCH - 12.15
TARPOTS CORNER - 12.25
THE WATERMILL - 12.40
FORTUNE OF WAR - 12.45

See you Thursday!`;
    const smsMessage = getSMSMessage(member.mobileNo, message);
    smsCollection.messages.push(smsMessage);
  }

  // console.log(smsCollection);
  // await sendSMS(smsCollection);
};

const getSMSMessage = (to: string, body: string) => {
  const smsMessage = new api.SmsMessage();

  smsMessage.from = "ShrimpTrust";
  smsMessage.to = to;
  smsMessage.body = body;

  // Schedule
  //   smsMessage.schedule = 1740160800;

  return smsMessage;
};

const getMemberList = async (filePath: string): Promise<Member[]> => {
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
