import { app } from "./app";
import mongoose from "mongoose";

const start = async () => {
  try {
    await mongoose.connect("mongodb://root:example@localhost:27017");
    console.log("Connected to mongodb");
  } catch (err) {
    console.log(err);
  }
  app.listen(3002, () => {
    console.log("Listening on port 3002 !");
  });
};

start();
