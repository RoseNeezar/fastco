import mongoose, { Document, model, Schema } from "mongoose";

interface User {
  email: string;
  password: string;
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
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

type IUserModel = mongoose.Model<
  UserDocument,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, UserDocument> &
    Omit<
      UserDocument & {
        _id: mongoose.Types.ObjectId;
      },
      never
    >,
  any
>;

const UserModel = (): IUserModel => {
  return mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : model<UserDocument>("User", userSchema);
};

export default UserModel;
