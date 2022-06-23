import { MongoClient, WithId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri: string = `mongodb+srv://tim:${process.env.MONGOPASS}@cluster0.k1aaw.mongodb.net/chattingapp?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
(async () => {
  await client.connect().catch((err) => {
    console.error(err);
  });
})();

export const createUser = async (body: any) => {
  const result = await client.db("chattingapp").collection("users").insertOne({
    email: body.email,
    password: body.password,
    interests: body.interests,
  });
  return result;
};
// getAllExamples();
