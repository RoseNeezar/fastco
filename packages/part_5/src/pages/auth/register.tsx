import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";

type InputValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(2, { message: "Please enter your email" }),
  password: z.string().min(2, { message: "Please enter your password" }),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const { mutateAsync, isLoading } = api.todo.register.useMutation({
    onSuccess: async () => {
      await router.push("/auth/login");
    },
  });

  const onSubmit = async (data: InputValues) => {
    try {
      await mutateAsync({
        email: data.email,
        password: data.password,
      });
    } catch (error) {}

    reset();
  };

  return (
    <div className="m-auto h-screen bg-base-300">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm bg-gray-800 p-10 lg:w-96">
            <div className="mt-8">
              <div>
                <div className="relative mt-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="rounded-lg bg-zinc-500 p-3 text-lg text-primary-content">
                      Register
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <form
                  method="POST"
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div>
                    <div className="flex w-full justify-center ">
                      <div className="form-control w-full ">
                        <label className="label">
                          <span className="label-text text-lg">Email</span>
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="Type here"
                          className="input-bordered input "
                        />
                        <label className="label">
                          {errors.email && (
                            <span className="label-text-alt text-red-600">
                              {errors.email.message}
                            </span>
                          )}
                        </label>
                        <label className="label">
                          <span className="label-text text-lg">Password</span>
                        </label>
                        <input
                          {...register("password")}
                          type="password"
                          placeholder="Type here"
                          className="input-bordered input "
                        />
                        <label className="label">
                          {errors.password && (
                            <span className="label-text-alt text-red-600">
                              {errors.password.message}
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`btn-primary btn flex w-full justify-center px-4 py-2 text-sm ${
                      isLoading && "loading"
                    }`}
                  >
                    Ok
                  </button>
                </form>
                <div className="mt-5 flex text-primary">
                  <p> Have an account ?</p>
                  <Link
                    href={"/auth/login"}
                    className="link-secondary link ml-2 font-bold"
                  >
                    login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
