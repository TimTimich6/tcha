import config from "./config";
import nodemailer from "nodemailer";
import { google } from "googleapis";
import { oauth2 } from "googleapis/build/src/apis/oauth2";

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
  var mailOptions = {
    from: "obraztsov.timo@gmail.com",
    to: recipient,
    subject: "Your password has been reset",
    html: `<h1>Your new password is ${password}</h1>`,
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
