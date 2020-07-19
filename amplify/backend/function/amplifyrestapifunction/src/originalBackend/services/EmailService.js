var nodemailer = require("nodemailer");
var aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();

aws.config.update({
  accessKeyId: process.env.SES_ACCESS,
  secretAccessKey: process.env.SES_SECRET,
  region: "us-east-1",
});

var transporter = nodemailer.createTransport({
  SES: new aws.SES({
    apiVersion: "2010-12-01",
  }),
});

class EmailService {
  static async sendSESEmail(newEmail) {
    const body = newEmail.body;
    const recipient = newEmail.recipient;
    const subject = newEmail.subject;
    const params = {
      from: body + " via WebsiteHere email@email.com",
      to: recipient,
      subject: subject,
      text: body,
      // replyTo: body + " email@email.com",
    };

    try {
      return await transporter.sendMail(params);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EmailService;
