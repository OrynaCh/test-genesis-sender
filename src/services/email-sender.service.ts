import AWS from "aws-sdk";
import { validateEmailAddress } from "../validators/validators";

export class EmailSenderService implements IEmailSenderService {
  constructor() {
    AWS.config.update({region: "us-east-1"});
  }

  public async sendEmails(emails: string[], bitcoinRate: number): Promise<IEmailDispatchResult> {
    const validEmails = [];
    const invalidEmails = [];
    emails.forEach((email: string) => validateEmailAddress(email)
      ? validEmails.push(email)
      : invalidEmails.push(email));
    const params = {
      Destination: {
        ToAddresses: validEmails,
      },
      Message: {
        Body: {
          Text: {
          Charset: "UTF-8",
          Data: bitcoinRate.toString(),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "BTC to UAH rate",
        },
      },
      Source: "oryna.chubych@gmail.com",
    };

    try {
      await new AWS.SES({ apiVersion: "2010-12-01" }).sendEmail(params).promise();
      return { failedEmails: invalidEmails};
    } catch (error) {
      // in case of error SES fails the batch completely
      return { failedEmails: emails, error: error.message };
    }
  }
}

export interface IEmailDispatchResult {
  failedEmails: string[];
  error?: string;
}

export interface IEmailSenderService {
  sendEmails(emails: string[], rate: number): Promise<IEmailDispatchResult>;
}
