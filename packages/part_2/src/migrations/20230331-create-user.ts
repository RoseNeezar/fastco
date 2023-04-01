import mongoose from "mongoose";
import { UserAttrs, User } from "../models/user.models";
import {
  hasMigrationBeenExecuted,
  removeMigrationHistory,
  saveMigrationHistory,
} from "../utils/migration_utils";

const migrationName = "createUsers";

const users: UserAttrs[] = [
  { email: "user1@example.com", password: "password1", firstName: "User1" },
  { email: "user2@example.com", password: "password2", firstName: "User2" },
  {
    email: "user10@example.com",
    password: "password10",
    firstName: "User10",
  },
];

export const up = async () => {
  try {
    if (await hasMigrationBeenExecuted(migrationName)) {
      console.log("Migration already executed:", migrationName);
      return;
    }

    for (const userAttrs of users) {
      const existingUser = await User.findOne({ email: userAttrs.email });
      if (!existingUser) {
        const user = User.build(userAttrs);
        await user.save();
      } else {
      }
    }

    await saveMigrationHistory(migrationName);
  } catch (error) {
    console.error("Error during migration:", error);
  }
};

export const down = async () => {
  try {
    if (!(await hasMigrationBeenExecuted(migrationName))) {
      console.log("Migration has not been executed:", migrationName);
      await mongoose.connection.close();
      return;
    }

    for (const userAttrs of users) {
      const existingUser = await User.findOne({ email: userAttrs.email });
      if (existingUser) {
        await User.deleteOne({ _id: existingUser._id });
        console.log("User deleted:", existingUser.email);
      } else {
        console.log("User not found:", userAttrs.email);
      }
    }

    await removeMigrationHistory(migrationName);
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error during reverting migration:", error);
  }
};
