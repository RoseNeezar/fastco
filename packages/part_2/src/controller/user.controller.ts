import { Response } from "express";
import { User } from "../models/user.models";
import { RequestTyped } from "../types/types";
import fs from "fs";

export const getUserByUsername = async (
  req: RequestTyped<{}, {}, { username: string }>,
  res: Response
) => {
  const username = req.params.username;

  const user = await User.findOne({ username: username });

  if (!user) {
    throw new Error("User not found");
  }

  res.status(200).send(user);
};

export const searchUser = async (
  req: RequestTyped<{}, { search?: string }, {}>,
  res: Response
) => {
  let searchObj = {};

  if (req.query.search !== undefined) {
    searchObj = {
      $or: [
        { firstName: { $regex: req.query.search, $options: "i" } },
        { lastName: { $regex: req.query.search, $options: "i" } },
        { username: { $regex: req.query.search, $options: "i" } },
      ],
    };
  }

  User.find(searchObj)
    .then((results) => res.status(200).send(results))
    .catch((error) => {
      console.log(error);
      throw new Error("no user found");
    });
};

export const updateProfileBanner = async (
  req: RequestTyped<{}, {}, { userId: string }>,
  res: Response
) => {
  //@ts-ignore
  if (!req.file) {
    console.log("No file uploaded with ajax request.");
    throw new Error("No file uploaded with ajax request.");
  }

  try {
    req.currentUserIp = await User.findByIdAndUpdate(
      // req.currentUserIp?.id,
      // { coverPhoto: `${process.env.APP_URL}/images/${req.file.filename}` },
      { new: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.log(error);
    throw new Error("no file found");
  }
};
