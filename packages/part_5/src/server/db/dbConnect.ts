import mongoose from "mongoose";
import { env } from "../../env.mjs";

const dbConnect = async () => {
  if (!env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  const uri = env.MONGODB_URI;
  await mongoose.connect(uri);
};

dbConnect().catch((err) => console.log(err));

export default dbConnect;
