import express from "express";
import * as db from "./mongocommands";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3080;

app.post("/api/signup", async (req, res) => {
  console.log("received /api");
  const body: db.newUser = req.body;
  console.log("data", body);
  try {
    await db.createUser(body.username, body.password);
    res.json({ message: "created user", user: body });
  } catch (error) {
    res.json({ message: "failed to create user" });
  }
});

app.post("/api/login", async (req, res) => {});

app.post("/api", async (req, res) => {
  console.log("received /api");
  res.send("/switched url to /api/signup");
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
