import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandOutput,
} from "@aws-sdk/client-ses";

export type TEmailPayload = {
  sourceEmail: string;
  toAddresses: string[];
  subject: string;
  textBody: string;
  htmlBody: string;
};

const sendEmail = async (
  payload: TEmailPayload & { accessKeyId: string; secretAccessKey: string }
) => {
  console.log(
    "Using AWS Credentials:",
    payload.accessKeyId,
    payload.secretAccessKey
  );

  const region = "ap-south-1";
  const sesClient = new SESClient({
    region,
    credentials: {
      accessKeyId: payload.accessKeyId,
      secretAccessKey: payload.secretAccessKey,
    },
  });

  const emailParams = {
    Source: payload.sourceEmail,
    Destination: {
      ToAddresses: payload.toAddresses,
    },
    Message: {
      Subject: {
        Data: payload.subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: payload.textBody,
          Charset: "UTF-8",
        },
        Html: {
          Data: payload.htmlBody,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(emailParams);
    console.log(
      "Using AWS Credentials:",
      payload.accessKeyId,
      payload.secretAccessKey
    );
    console.log("hiiii"), console.log("emailParams");
    console.log("sesClient", sesClient);
    const response = await sesClient.send(command);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
