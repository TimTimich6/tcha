import express from "express";
import * as db from "./mongocommands";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
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
    const exists = await db.getUserFromUsername(body.username.toLowerCase());
    if (exists) throw "Already exists";
    const response = await axios.get(`https://api.eva.pingutil.com/email?email=${body.username.toLowerCase()}`);
    if (response.data.status == "success") {
      await db.createUser(body.username.toLowerCase(), body.password);
      res.json({ message: "created user", user: body });
    } else throw new Error();
  } catch (error) {
    res.status(400).json({ error, message: "failed to create user" });
  }
});

app.put("/api/signup", async (req, res) => {
  const body: { interests: string; username: string } = req.body;
  try {
    if (typeof body.interests == "string") {
      const interests = body.interests.split(":");
      console.log("interests", interests);
      console.log("email", body.username);

      await db.updateInterests(interests, body.username.toLowerCase());
      res.json({ message: "successfully updated interests", success: true });
    } else throw "Incorrect body";
  } catch (error) {
    res.status(400).json({ error, success: false });
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
    res.status(400).json({ error, success: false });
  }
});

app.get("/api/forgetpassword", async (req, res) => {
  let email = <string>req.query.email;
  try {
    if (email) {
      email = email.toLowerCase();
      const resp = await db.getUserFromUsername(email);
      if (resp) {
        const newPass = generatepassword.generate({ length: 10, numbers: true });
        await db.resetPassword(email, newPass);
        await send_mail(email, newPass);
        res.json({ message: "sent email", email, success: true });
      } else {
        console.log("user not found");
        throw "User doesn't exist";
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error, success: false });
  }
});

app.post("/api", async (req, res) => {
  console.log("received /api");
  res.send("/switched url to /api/signup");
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
