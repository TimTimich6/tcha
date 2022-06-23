import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
export const secret = "whitelistaiosecret";

export const isAuthed = (req: Request | any, res: Response, next: Function) => {
  const cookie = req.headers.cookie;
  try {
    if (cookie) {
      const token = cookie.split("jwt=")[1];
      const verf = jwt.verify(token, secret);
      console.log("verf: ", verf);
      req.jwt = verf;
      next();
    } else throw new Error();
  } catch (error) {
    console.log("failed to auth");
    res.status(400).json({ title: "Sign In Error", description: "Resign in with discord" });
  }
};
