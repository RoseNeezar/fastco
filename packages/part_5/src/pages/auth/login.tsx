import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

type InputValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z.string().min(2, { message: "Please enter your email" }),
  password: z.string().min(2, { message: "Please enter your password" }),
});

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InputValues>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: InputValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!result?.ok) {
        toast.error(result?.error || "sign in error");
      } else {
        if (router.query.callbackUrl) {
          await router.push(router.query.callbackUrl as string);
        } else {
          await router.push("/");
        }
      }

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }

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
                      Login
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
                          <span className="label-text text-lg">Password</span>
                        </label>
                        <input
                          {...register("password")}
                          autoComplete="current-password"
                          type="password"
                          placeholder="Type here"
                          className="input-bordered input "
                        />
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
                  <p> Don't have an account ?</p>
                  <Link
                    href={"/auth/register"}
                    className="link-secondary link ml-2 font-bold"
                  >
                    register
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

export default Login;
