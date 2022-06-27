import { Document, MongoClient, WithId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri: string = `mongodb+srv://tim:${process.env.MONGOPASS}@cluster0.k1aaw.mongodb.net/chattingapp?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
(async () => {
  await client.connect().catch((err) => {
    console.error(err);
  });
})();

export const createUser = async (username: string, password: string) => {
  await client.db("chattingapp").collection("users").insertOne({
    username: username,
    password: password,
    creationtime: Date.now(),
  });
};

export const loginUser = async (username: string, password: string): Promise<null | WithId<Document>> => {
  const result = await client.db("chattingapp").collection("users").findOne({ username, password });
  return result;
};

export const getUserFromUsername = async (username: string): Promise<WithId<Document> | null> => {
  const result = await client.db("chattingapp").collection("users").findOne({ username });
  return result;
};

export const resetPassword = async (username: string, password: string): Promise<void> => {
  await client.db("chattingapp").collection("users").updateOne({ username }, { $set: { password } });
};

export const updateInterests = async (interests: string[], username: string): Promise<void> => {
  await client.db("chattingapp").collection("users").updateOne({ username }, { $set: { interests } });
};

export const createChatRoom = async (username: string, title: string, tag: string): Promise<void> => {
  await client
    .db("chattingapp")
    .collection("chatrooms")
    .insertOne({ username, title, tag: tag.trim(), deletetime: Date.now() + 86_400_0000, creationtime: Date.now() });
};

export const getChatroomsFromUser = async (username: string): Promise<WithId<Document>[] | null> => {
  const result = await client.db("chattingapp").collection("chatrooms").find({ username }).toArray();
  if (result) return result;
  return [];
};

export interface UserQuery {
  username: string;
  password: string;
}
// getAllExamples();
