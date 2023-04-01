import { Response } from "express";
import { User } from "../models/user.models";
import { RequestTyped } from "../types/types";
import fs from "fs";

export const getUsersList = async (
  req: RequestTyped<{}, {}, {}>,
  res: Response
) => {
  const user = await User.find();

  if (!user) {
    return res.status(404).json({ message: "Users not found" });
  }

  res.status(200).send(user);
};

export const updateProfileBanner = async (
  req: RequestTyped<{}, { email: string }, {}>,
  res: Response
) => {
  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    return res
      .status(404)
      .json({ message: "No file uploaded with ajax request." });
  }

  let currentUser = await User.findOne({
    email: req.query.email,
  });

  if (!currentUser) {
    return res.status(404).json({ message: "Users not found" });
  }

  const oldProfilePicTemp = currentUser!.profilePic!.split("/");
  const imgRex = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  if (oldProfilePicTemp) {
    const oldBanner = oldProfilePicTemp[oldProfilePicTemp!.length - 1];
    if (imgRex.test(oldBanner)) {
      const filePath = `public/images/${oldBanner}`;
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (error) {
          console.error(`Error deleting file: ${error.message}`);
        }
      }
    }
  }
  try {
    currentUser = await User.findByIdAndUpdate(
      currentUser?.id,
      { profilePic: `${process.env.APP_URL}/images/${req.file.filename}` },
      { new: true }
    );

    res.sendStatus(204).json({ message: "Ok" });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "No file uploaded with ajax request." });
  }
};
