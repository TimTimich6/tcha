import { Document, MongoClient, WithId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const uri: string = `mongodb+srv://tim:${process.env.MONGOPASS}@cluster0.k1aaw.mongodb.net/chattingapp?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
(async () => {
  await client.connect().catch((err) => {
    console.error(err);
  });
  setInterval(async () => {
    await client
      .db("chattingapp")
      .collection("users")
      .deleteMany({ deletime: { $lt: Date.now() } });
  }, 60000);
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
  await client.db("chattingapp").collection("users").updateOne({ username: username.toLowerCase() }, { $set: { interests } });
};

export const createChatRoom = async (username: string, title: string, tag: string): Promise<void> => {
  await client
    .db("chattingapp")
    .collection("chatrooms")
    .insertOne({ username, title: title.trim().toLowerCase(), tag: tag.trim(), deletetime: Date.now() + 2 * 60000, creationtime: Date.now() });
};

export const getChatroomsFromUser = async (username: string): Promise<WithId<Document>[] | null> => {
  const result = await client
    .db("chattingapp")
    .collection("chatrooms")
    .find({ username }, { projection: { title: 1, tag: 1, deletetime: 1, _id: 0 } })
    .toArray();
  if (result) return result;
  return [];
};

export const getByInterest = async (username: string): Promise<WithId<Document>[] | null> => {
  const user = await client.db("chattingapp").collection("users").findOne({ username: username.toLowerCase() });
  console.log(user);
  if (user) {
    const interests: string[] = user.interests;
    const rooms = await client
      .db("chattingapp")
      .collection("chatrooms")
      .find({ tag: { $in: interests } })
      .toArray();
    console.log(rooms);
    return rooms;
  } else return [];
};

export interface UserQuery {
  username: string;
  password: string;
}
// getAllExamples();
