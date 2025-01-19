import mailConfig from "config/mail.config";
import nodemailer, { Transporter } from "nodemailer";

export default class MailService {
  private static transporter: Transporter = nodemailer.createTransport(mailConfig);

  static async sendMail(to: string, subject: string, text?: string, html?: string) {
    try {
      await MailService.transporter.sendMail({ from: "kelk-mail", to, subject, text, html });
    } catch (error) {
      throw new Error("Error sending email");
    }
  }
}
