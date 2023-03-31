import express from "express";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { searchUser, updateProfileBanner } from "../controller/user.controller";
import { currentUser } from "../middlewares/currrent-user.middleware";
import { makeId } from "../utils/helpers";

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = makeId(15);
      callback(null, name + path.extname(file.originalname)); // e.g. jh34gh2v4y + .png
    },
  }),
  fileFilter: (_, file: any, callback: FileFilterCallback) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, true);
    } else {
      callback(new Error("Not an image"));
    }
  },
});
const UserRoute = express.Router();

UserRoute.route("/").get(currentUser, searchUser);

UserRoute.route("/coverPhoto").post(
  currentUser,
  upload.single("croppedImage"),
  updateProfileBanner
);

export default UserRoute;
