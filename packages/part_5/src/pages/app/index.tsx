import { useDisclosure } from "@mantine/hooks";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";
import dayjs from "dayjs";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { FC } from "react";
import Form from "../../components/Forms";
import { appRouter } from "../../server/api/root";
import { createTRPCContext } from "../../server/api/trpc";
import { api } from "../../utils/api";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { Task } from "../../server/models/task.models";

const Todos: FC<Task & { id?: string }> = (data) => {
  const router = useRouter();
  const queryClient = api.useContext();
  const { mutateAsync, isLoading } = api.todo.deleteTodo.useMutation({
    onSuccess: async () => {
      await queryClient.todo.getTodos.invalidate();
    },
  });
  return (
    <div
      className="mb-4 flex w-full max-w-lg cursor-pointer flex-col rounded-lg bg-base-300 p-5 text-primary-content hover:bg-base-200"
      onClick={() => {
        router.push({
          pathname: "/app/[id]",
          query: { id: data.id },
        });
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-lg">{data.title}</div>
        <button
          className={`btn-circle btn bg-red-700 ${isLoading && "loading"}`}
          onClick={(e) => {
            e.stopPropagation();
            mutateAsync({
              id: data.id!,
            });
          }}
        >
          X
        </button>
      </div>
      <div className="mt-4 flex flex-row items-center ">
        <div className="">{dayjs(data.dueDate).format("DD/MM/YYYY")}</div>
      </div>
    </div>
  );
};

const App = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data, isLoading } = api.todo.getTodos.useQuery();
  return (
    <div>
      <Form event="create" close={close} opened={opened} />
      <div className="mt-10 flex justify-center">
        <button className="btn-primary btn gap-2" onClick={open}>
          <i className="bx bxs-plus-circle text-2xl"></i>
          add Todo
        </button>
      </div>
      <div className="mt-10 flex flex-1 flex-col items-center justify-center">
        {isLoading ? (
          <div className="loading" />
        ) : (
          <>
            {data?.map((t) => {
              return <Todos key={t.id} {...t} />;
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default App;

export async function getServerSideProps(
  context: GetServerSidePropsContext & CreateNextContextOptions
) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: await createTRPCContext({
      req: context.req,
      res: context.res,
    }),
    transformer: superjson,
  });

  await ssg.todo.getTodos.prefetch();
  return {
    props: {
      trpcState: JSON.parse(JSON.stringify(ssg.dehydrate())),
    },
  };
}
