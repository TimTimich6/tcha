import { MongoClient, WithId } from "mongodb";

const uri: string = "mongodb+srv://tim:tallkitten47@cluster0.k1aaw.mongodb.net/xpgrinder?retryWrites=true&w=majority";
const client = new MongoClient(uri);
(async () => {
  await client.connect().catch((err) => {
    console.error(err);
  });
})();

export const createUser = async (body: any) => {
  const result = await client.db("startup").collection("users").insertOne({
    email: body.email,
    password: body.password,
    interests: body.interests,
  });
  return result;
};
// getAllExamples();
