import { Collection, MongoClient, ObjectId } from "mongodb";

const uri = "mongodb://root:example@localhost:27017";

const client = new MongoClient(uri);

interface UserDocument {
  _id: ObjectId;
  age: number;
  email: string;
  status: string;
}

// 1. Find all documents where the "age" field is greater than 25
const Q1 = async (collection: Collection<UserDocument>) => {
  return await collection.find({ age: { $gt: 25 } }).toArray();
};

// 2. Update the "email" field of a document with a specific ID
const Q2 = async (collection: Collection<UserDocument>) => {
  const newEmail = "new_email@example.com";
  return await collection.updateOne(
    { _id: new ObjectId("specific_id") },
    { $set: { email: newEmail } }
  );
};

// 3. Delete all documents where the "status" field is set to "inactive"
const Q3 = async (collection: Collection<UserDocument>) => {
  return await collection.deleteMany({ status: "inactive" });
};

async function main() {
  try {
    await client.connect();
    const db = client.db("part_1");
    const collection = db.collection<UserDocument>("users");

    const [q1Result, q2Result, q3Result] = await Promise.all([
      Q1(collection),
      Q2(collection),
      Q3(collection),
    ]);

    console.log("Q1 result:", q1Result);
    console.log("Q2 result:", q2Result);
    console.log("Q3 result:", q3Result);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

main();
