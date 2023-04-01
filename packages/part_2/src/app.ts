import bodyParser, { json } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import UserRoute from "./routes/user.routes";

dotenv.config();

const app = express();
app.set("trust proxy", true);
app.use(json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use(cors());

app.use(express.static("public"));

app.use("/api/users", UserRoute);

app.all("*", async () => {
  throw new Error();
});

export { app };
