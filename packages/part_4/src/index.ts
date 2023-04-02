import { Collection, MongoClient, ObjectId } from "mongodb";
import fs from "fs";
import csvParser from "csv-parser";

const uri = "mongodb://root:example@localhost:27017";

const client = new MongoClient(uri);

const csvFilePath = "public/data.csv";

interface UserDocument {
  _id: ObjectId;
  age: number;
  email: string;
  status: string;
}

// 1. Write a Node.js script that reads a CSV file and inserts the data into a MongoDB collection.
const Q1 = async (collection: Collection<UserDocument>) => {
  const data: UserDocument[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row: Partial<UserDocument>) => {
        if (row.age && row.email && row.status) {
          row._id = new ObjectId();
          data.push(row as UserDocument);
        } else {
          console.error("Invalid data row:", row);
        }
      })
      .on("end", async () => {
        console.log("CSV file successfully processed");

        try {
          const result = await collection.insertMany(data);
          console.log(
            `Successfully inserted ${result.insertedCount} documents`
          );
          resolve();
        } catch (error) {
          console.error("Error inserting data", error);
          reject(error);
        }
      });
  });
};

// 3. Delete all documents where the "status" field is set to "inactive"
const Q3 = async (data: string) => {
  const words = data.trim().split(/\s+/);
  return words.length;
};

async function main() {
  try {
    await client.connect();
    const db = client.db("part_3");
    const collection = db.collection<UserDocument>("users");

    await Promise.all([Q1(collection)]);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

main();
