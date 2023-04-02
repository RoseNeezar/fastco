import React from "react";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { useDisclosure } from "@mantine/hooks";
import Form from "../../components/Forms";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import { GetServerSidePropsContext } from "next";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";

type Props = {};

const Todo = (props: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const [opened, { open, close }] = useDisclosure(false);

  const { mutateAsync, isLoading } = api.todo.deleteTodo.useMutation({
    onSuccess: async () => {
      router.back();
    },
  });

  const { data, isLoading: loadingData } = api.todo.getTodoById.useQuery(
    {
      id: id as string,
    },
    {
      enabled: !!id,
    }
  );

  if (loadingData) {
    return <div className="loading"></div>;
  }
  if (!data) {
    router.push("/app");
    return null;
  }

  console.log("data==", data);
  return (
    <div className="mt-10 flex flex-grow justify-center">
      <Form event="update" close={close} opened={opened} todoData={data} />
      <div className="h-fit w-[750px] max-w-6xl rounded-lg bg-base-300 p-10">
        <div className="flex justify-end">
          <button className="btn-primary btn mr-5 " onClick={open}>
            Edit
          </button>
          <button
            className={`btn bg-red-600 text-primary-content ${
              isLoading && "loading"
            }`}
            onClick={() =>
              mutateAsync({
                id: data!.id,
              })
            }
          >
            X
          </button>
        </div>
        <div className="mt-10">
          <label className="mb-2 text-lg font-bold text-secondary">Title</label>
          <h1 className="mb-2 rounded-lg bg-base-100 p-3">{data?.title}</h1>
        </div>
        <div className="mt-10">
          <label className="mb-2 text-lg font-bold text-secondary">
            Description
          </label>
          <h1 className="mb-2 rounded-lg bg-base-100 p-3">
            {data?.description}
          </h1>
        </div>

        <div className="flex flex-col justify-between">
          <label className="mb-2 text-lg font-bold text-secondary">
            Due Date
          </label>
          <h1>{dayjs(data?.dueDate).format("DD/MM/YYYY")}</h1>
        </div>
      </div>
    </div>
  );
};

export default Todo;

export async function getServerSideProps(
  context: GetServerSidePropsContext & CreateNextContextOptions
) {
  const todoId = context.query.id as string;

  if (!todoId) return;

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: context.req,
      res: context.res,
    }),
    transformer: superjson,
  });

  await ssg.todo.getTodoById.prefetch({
    id: todoId,
  });

  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())),
    },
  };
}
