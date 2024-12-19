import AWS from "npm:aws-sdk";

const awsRegion = Deno.env.get("AWS_REGION") || "eu-west-1";
const fromEmail = Deno.env.get("FROM_EMAIL") || "";
const replyToAddress = Deno.env.get("REPLY_TO_EMAIL") || "";

if (!fromEmail) {
  throw new Error("FROM_EMAIL environment variable not set");
}

if (!replyToAddress) {
  throw new Error("REPLY_TO_ADDRESS environment variable not set");
}

type sendPasswordResetEmailResponse = {
  messageId: string;
  htmlMessage: string;
  textMessage: string;
};

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  username: string,
  password: string,
): Promise<sendPasswordResetEmailResponse> => {
  if (!email) {
    throw new Error("Email address is required");
  }
  if (!name) {
    throw new Error("Name is required");
  }
  if (!username) {
    throw new Error("Username is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }

  const htmlMessage = generateHTMLMessage(name, username, password);
  const textMessage = generateTextMessage(name, username, password);

  // Set the region
  AWS.config.update({ region: awsRegion });

  // Create sendEmail params
  const params = {
    Destination: {
      /* required */
      CcAddresses: [],
      ToAddresses: [
        email,
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: htmlMessage,
        },
        Text: {
          Charset: "UTF-8",
          Data: textMessage,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Shrimpers Trust Password Reset",
      },
    },
    Source: fromEmail,
    ReplyToAddresses: [
      replyToAddress,
    ],
  };

  // Create the promise and SES service object

  const data = await new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  console.log(data.MessageId);
  return { messageId: data.MessageId, htmlMessage, textMessage };
};

const generateHTMLMessage = (
  name: string,
  username: string,
  password: string,
) => {
  return `
    <!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .credentials {
      background-color: #f4f4f4;
      padding: 10px;
      border-radius: 5px;
      margin: 15px 0;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <p>Hello ${name}!</p>

  <p>Thank you for contacting us.</p>

  <div class="credentials">
    Username: ${username}<br>
    Password: ${password}
  </div>

  <p>Many thanks,</p>
  <p>Jon-Paul</p>
</body>
</html>
`;
};

const generateTextMessage = (
  name: string,
  username: string,
  password: string,
) => {
  return `
    Hello ${name}!

    Thank you for contacting us.

    Username: ${username}
    Password: ${password}

    Many thanks,
    Jon-Paul
`;
};
