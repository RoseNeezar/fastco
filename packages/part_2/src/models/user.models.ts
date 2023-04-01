import mongoose, { Schema } from "mongoose";

export interface UserAttrs {
  email: string;
  password: string;
  firstName: string;
  profilePic?: string;
}

export interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
  firstName: string;
  profilePic?: string;
}

export interface UserModel extends mongoose.Model<UserDoc> {
  build(attr: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: {
      type: String,
      default: `https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y')`,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.statics.build = (attr: UserAttrs) => {
  return new User(attr);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
