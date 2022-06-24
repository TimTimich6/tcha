import express from "express";
import * as db from "./mongocommands";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3080;

app.post("/api/signup", async (req, res) => {
  console.log("received post /api/signup");
  const body: db.UserQuery = req.body;
  console.log("data", body);
  try {
    const response = await axios.get(`https://api.eva.pingutil.com/email?email=${body.username}`);
    if (response.data.status == "success") {
      await db.createUser(body.username, body.password);
      res.json({ message: "created user", user: body });
    } else throw new Error();
  } catch (error) {
    res.json({ message: "failed to create user" });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("received post /api/login");
  const body: db.UserQuery = req.body;
  try {
    const response = await db.loginUser(body.username, body.password);
    if (response == null) throw { message: "null value" };
    res.json({ message: "successful signin", time: Date.now(), success: true });
  } catch (error) {
    res.json({ error, success: false });
  }
});

app.post("/api/forgetpassword", async (req, res) => {
  const email = req.query.email;
  try {
    if (email) {
      const resp = await db.getPassword(<string>email);
      if (resp) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "davidtbuford@gmail.com",
            pass: "tallkitten47",
          },
        });

        var mailOptions = {
          from: "davidtbuford@gmail.com",
          to: <string>email,
          subject: "fuck off",
          html: "<h1>You can suck my dick</p>",
        };

        transporter.sendMail(mailOptions, function (error: any, info: any) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
        res.json({ message: "sent email" });
      } else {
        res.json({ message: "sent email" });
      }
    }
  } catch (error) {
    res.json({ error, success: false });
  }
});

app.post("/api", async (req, res) => {
  console.log("received /api");
  res.send("/switched url to /api/signup");
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
