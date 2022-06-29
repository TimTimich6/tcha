import express from "express";
import * as db from "./mongocommands";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { send_mail } from "./sendmail";
import generatepassword from "generate-password";
import morgan from "morgan";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("common"));
const PORT = process.env.PORT || 3080;

app.post("/api/signup", async (req, res) => {
  const body: db.UserQuery = req.body;
  console.log("data", body);
  try {
    const exists = await db.getUserFromUsername(body.username.toLowerCase());
    if (exists) throw "Already exists";
    const response = await axios.get(`https://api.eva.pingutil.com/email?email=${body.username.toLowerCase()}`);
    if (response.data.status == "success") {
      await db.createUser(body.username.toLowerCase(), body.password);
      res.json({ message: "successful signin", user: body });
    } else throw new Error();
  } catch (error) {
    res.status(400).json({ error, message: "failed to create user" });
  }
});

app.put("/api/signup", async (req, res) => {
  const body: { interests: Array<string>; username: string } = req.body;
  try {
    if (Array.isArray(body.interests)) {
      const interests = body.interests;
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

app.post("/api/chatroom", async (req, res) => {
  const body: { username: string; tag: string; title: string } = req.body;
  try {
    if (!body.username || !body.tag || !body.title) throw "property missing";
    await db.createChatRoom(body.username, body.title, body.tag);
    res.json({ message: "created chatroom", username: body.username, success: true });
  } catch (error) {
    res.status(401).json({ error, success: false });
  }
});

app.get("/api/chatroom", async (req, res) => {
  const username = <string>req.query.username;
  try {
    if (!username) throw "No username";
    const rooms = await db.getChatroomsFromUser(username);

    if (rooms) res.json({ rooms });
    else res.json([]);
  } catch (error) {
    res.status(401).json({ error, success: false });
  }
});
app.post("/api", async (req, res) => {
  res.send("/switched url to /api/signup");
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
