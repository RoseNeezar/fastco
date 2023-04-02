import express from "express";
import { getUsersList, updateProfilePic } from "../controller/user.controller";
import { currentUserIp } from "../middlewares/currrent-user.middleware";
import multer, { FileFilterCallback } from "multer";
import { v4 } from "uuid";
import path from "path";

const upload = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (_, file, callback) => {
      const name = v4();

      callback(null, name + path.extname(file.originalname));
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

UserRoute.route("/").get(currentUserIp, getUsersList);

UserRoute.route("/profilePic").post(
  currentUserIp,
  upload.single("profilePic"),
  updateProfilePic
);

export default UserRoute;
