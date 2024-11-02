// https://learn.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0

import qs from "npm:qs";
import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential, ChainedTokenCredential } from "@azure/identity";

const tenantId = Deno.env.get("AZURE_TENANT_ID") || "";
const clientId = Deno.env.get("AZURE_CLIENT_ID") || "";
const clientSecret = Deno.env.get("AZURE_CLIENT_SECRET") || "";

async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
  const params = {
    client_id: clientId,
    client_secret: clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const options = {
    method: "POST",
    headers,
    body: qs.stringify(params),
  };

  try {
    const response = await fetch(
      url,
      options,
    );

    return response.json();
  } catch (error) {
    console.error("Error getting access token:", error);
  }
}

async function getGraphClient() {
  const accessToken = await getAccessToken();

  const client =  Client.init({
    authProvider: (done) => {
      done(null, accessToken.access_token);
    },
  });

  return client;
}

const client = await getGraphClient();

console.log("Client:", client);

await getExcelSession()

async function getExcelSession() {
    const fileId = "3A887016-26C0-4DCA-903C-5472382BF741";
    const userId = "eb5a0745-ef5c-46b4-829b-6790f0f95dc6"; // Treasurer
//   const session = await client.api("/me/drive/items/3A887016-26C0-4DCA-903C-5472382BF741/workbook/createSession");

const rangeAddress = "Sheet1!A1";
const rangeData = {
    values: [["Hello, Excel from Node.js!"]],
  };

//   await client
//   .api(`/user/${userId}/drive/items/${fileId}/workbook/worksheets/Sheet1/range(address='${rangeAddress}')`)
//   .header("Content-Type", "application/json")
//   .patch(rangeData);


 const usersResp = await client.api(`/users`)
                            .get();

    console.log("Users:", usersResp);


//   console.log("Excel:", session.);

//   // Write cell A1
//     const cell = {
//         values: [[1]],
//     };
//     await client.api("/me/drive/root:/Book1.xlsx:/workbook/worksheets/Sheet1/range('A1')/values")
//         .patch(cell);
}