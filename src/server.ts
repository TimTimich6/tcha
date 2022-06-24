import express from "express";
import * as db from "./mongocommands";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import { send_mail } from "./sendmail";
import generatepassword from "generate-password";
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
      await db.createUser(body.username.toLowerCase(), body.password);
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
    const response = await db.loginUser(body.username.toLowerCase(), body.password);
    if (response == null) throw { message: "null value" };
    res.json({ message: "successful signin", time: Date.now(), success: true });
  } catch (error) {
    res.json({ error, success: false });
  }
});

app.get("/api/forgetpassword", async (req, res) => {
  const email = <string>req.query.email;
  try {
    if (email) {
      const resp = await db.getUserFromUsername(email);
      if (resp) {
        const newPass = generatepassword.generate({ length: 10, numbers: true });
        await db.resetPassword(email, newPass);
        await send_mail(email, newPass);
        res.json({ message: "sent email", email });
      } else {
        console.log("user not found");
        throw "User doesn't exist";
      }
    }
  } catch (error) {
    console.log(error);

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
