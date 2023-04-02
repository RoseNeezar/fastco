import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { api } from "../utils/api";
import { Task } from "../server/models/task.models";

interface IForm {
  event: "create" | "update";
  opened: boolean;
  close: () => void;
  todoData?: Task;
}

type InputValues = {
  title: string;
  description: string;
  dueDate: Date;
};

const schema = z.object({
  title: z.string().min(2, { message: "Please enter todo title" }),
  description: z.string().min(2, { message: "Please enter todo description" }),
  dueDate: z.date().default(new Date()),
});

const TodoForm: FC<{
  event: "create" | "update";
  close: () => void;
  todoData?: Task & { id?: string };
}> = ({ close, event, todoData }) => {
  const queryClient = api.useContext();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: todoData?.description,
      dueDate: todoData?.dueDate && new Date(todoData?.dueDate),
      title: todoData?.title,
    },
  });

  const { mutateAsync: createMutTodo, isLoading: createMutLoading } =
    api.todo.createTodo.useMutation({
      onSuccess: async () => {
        await queryClient.todo.getTodos.invalidate();
      },
    });
  const { mutateAsync: updateMutTodo, isLoading: updateMutLoading } =
    api.todo.updateTodo.useMutation({
      onSuccess: async () => {
        await queryClient.todo.getTodoById.invalidate();
      },
    });

  const onSubmit = async (data: InputValues) => {
    try {
      switch (event) {
        case "create":
          await createMutTodo({
            ...data,
          });
          break;
        case "update":
          await updateMutTodo({
            ...data,
            id: todoData!.id!,
          });
        default:
          break;
      }
    } catch (error) {
      toast.error(JSON.stringify(error));
    }

    reset();
    close();
  };
  console.log(
    "=========",
    todoData,
    todoData?.dueDate && new Date(todoData?.dueDate)
  );
  return (
    <form
      className="form-control w-full max-w-xs"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="label">
        <span className="label-text">Title</span>
      </label>
      <input
        {...register("title")}
        type="text"
        placeholder="Type here"
        defaultValue={todoData?.title}
        className={`${
          errors.title && "bg-error-content"
        } input-bordered input w-full max-w-xs`}
      />
      <label className="label mt-5">
        <span className="label-text">Description</span>
      </label>
      <textarea
        {...register("description")}
        placeholder="Type here"
        defaultValue={todoData?.description}
        className={`${
          errors.description && "bg-error-content"
        } textarea-bordered textarea`}
      />

      <label className="label mt-5">
        <span className="label-text">Due Date</span>
      </label>
      <Controller
        name="dueDate"
        control={control}
        render={({ field }) => (
          <DateInput
            {...field}
            defaultValue={todoData?.dueDate && new Date(todoData?.dueDate)}
            className=" w-full"
            placeholder="Date input"
            minDate={new Date()}
            variant="default"
            mx="auto"
          />
        )}
      />
      <button
        type="submit"
        className={`btn-primary btn mt-5 ${
          createMutLoading || (updateMutLoading && "loading")
        }`}
      >
        {event === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

const Form: FC<IForm> = ({ close, opened, event, todoData }) => {
  return (
    <Modal.Root opened={opened} onClose={close} centered>
      <Modal.Overlay />
      <Modal.Content className="bg-base-200">
        <Modal.Header className="bg-base-200">
          <Modal.Title className="text-2xl text-secondary">
            {event === "create" ? "Create Todo" : "Update Todo"}
          </Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body className="flex justify-center">
          <TodoForm event={event} close={close} todoData={todoData} />
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};

export default Form;
