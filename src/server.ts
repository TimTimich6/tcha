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
  const body = req.body;
  if (body.username && body.email && body.interests && body.password) {
    await db.createUser(body);
  }
  console.log();
});

app.post("/api/login", async (req, res) => {
  const body = req.body;
  if (body.username && body.email && body.interests && body.password) {
    await db.createUser(body);
  }
  console.log();
});
app.get("/", (req, res) => {
  res.send("congrats retard it worked");
});
app.post("/api", (req, res) => {
  console.log("received");

  res.json(req.body);
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
