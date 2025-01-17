import SMTPTransport from "nodemailer/lib/smtp-transport";
import environment from "./environment";

const mailConfig: SMTPTransport | SMTPTransport.Options = {
  host: environment.SMTPHost,
  port: environment.SMTPPort,
  secure: false,
  auth: {
    user: environment.SMPTUser,
    pass: environment.SMPTPassword,
  },
};

export default mailConfig;
