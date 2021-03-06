import config from "./config";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

const oauth = google.auth.OAuth2;

const ouathclient = new oauth(config.GOOGLEID, config.GOOGLESECRET);
ouathclient.setCredentials({ refresh_token: config.REFRESHTOKEN });

export async function send_mail(recipient: string, password: string) {
  const accesstoken = await ouathclient.getAccessToken();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      clientId: config.GOOGLEID,
      type: "OAUTH2",
      user: config.USER,
      refreshToken: config.REFRESHTOKEN,
      clientSecret: config.GOOGLESECRET,
    },
  });
  const filePath = path.join(__dirname, "../index.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  const replacements = {
    password,
  };
  var mailOptions = {
    from: "obraztsov.timo@gmail.com",
    to: recipient,
    subject: "Your password has been reset",
    html: template(replacements),
  };

  transporter.sendMail(mailOptions, function (error: any, info: any) {
    if (error) {
      console.log(error);
      throw "Failed to send";
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}
