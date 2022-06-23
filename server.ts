import express from "express";
import * as db from "./mongocommands";
const app = express();
const PORT = process.env.PORT || 3080;

app.post("/api/signup", async (req, res) => {
  const body = req.body;
  if (body.username && body.email && body.interests && body.password) {
    await db.createUser(body);
  }
  console.log();
});
app.listen(PORT, () => {
  console.log("listening on port", PORT);
});
