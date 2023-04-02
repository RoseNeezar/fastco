import mongoose, { Document, model, Schema } from "mongoose";

export interface Task {
  title: string;
  description: string;
  dueDate: Date;
  userId?: string;
}

export interface TaskDocument extends Task, Document {}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
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

type ITaskModel = mongoose.Model<
  TaskDocument,
  {},
  {},
  {},
  mongoose.Document<unknown, {}, TaskDocument> &
    Omit<
      TaskDocument & {
        _id: mongoose.Types.ObjectId;
      },
      never
    >,
  any
>;

const TaskModel = (): ITaskModel => {
  return mongoose.models && mongoose.models.Task
    ? mongoose.models.Task
    : model<TaskDocument>("Task", taskSchema);
};

export default TaskModel;
