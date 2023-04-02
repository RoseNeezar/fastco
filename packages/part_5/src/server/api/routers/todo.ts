import { hash } from "bcrypt";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  register: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const exists = await ctx.User.findOne({
        email,
      });

      if (exists) {
        return {
          status: "User exist",
        };
      } else {
        const user = await ctx.User.create({
          email,
          password: await hash(password, 10),
        });

        return user;
      }
    }),
  createTodo: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { description, dueDate, title } = input;
      const Task = ctx.Task;

      const newTask = new Task({
        title,
        description,
        dueDate,
        userId: ctx.session.user.id,
      });

      await newTask.save();

      return newTask;
    }),
  getTodos: protectedProcedure.query(async ({ ctx }) => {
    const todos = await ctx.Task.find({
      userId: ctx.session.user.id,
    })
      .sort({ dueDate: "asc" })
      .exec();
    return todos;
  }),
  getTodoById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const todo = await ctx.Task.findOne({
        _id: input.id,
      }).exec();

      if (!todo) {
        return null;
      }

      return todo;
    }),
  updateTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, description, dueDate, title } = input;
      const existingTask = await ctx.Task.findOne({
        _id: id,
      }).exec();

      if (!existingTask) {
        return null;
      }

      const newTodo = await ctx.Task.updateOne(
        { _id: id },
        {
          $set: {
            title,
            description,
            dueDate,
          },
        }
      ).exec();

      return newTodo;
    }),

  deleteTodo: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.Task.deleteOne({ _id: input.id }).exec();
    }),
});
