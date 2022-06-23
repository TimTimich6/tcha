"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthed = exports.secret = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.secret = "whitelistaiosecret";
const isAuthed = (req, res, next) => {
    const cookie = req.headers.cookie;
    try {
        if (cookie) {
            const token = cookie.split("jwt=")[1];
            const verf = jsonwebtoken_1.default.verify(token, exports.secret);
            console.log("verf: ", verf);
            req.jwt = verf;
            next();
        }
        else
            throw new Error();
    }
    catch (error) {
        console.log("failed to auth");
        res.status(400).json({ title: "Sign In Error", description: "Resign in with discord" });
    }
};
exports.isAuthed = isAuthed;
