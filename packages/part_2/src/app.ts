import bodyParser, { json } from "body-parser";
import cors from "cors";
import express from "express";
import "express-async-errors";
import UserRoute from "./routes/user.routes";

const app = express();
app.set("trust proxy", true);
app.use(json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));

app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

app.use(express.static("public"));

app.use("/api/users", UserRoute);

app.all("*", async () => {
  throw new Error();
});

export { app };
