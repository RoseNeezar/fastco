import { useSession, signOut, signIn } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthBtn: React.FC = () => {
  const { data: sessionData } = useSession();
  return (
    <div className="flex flex-row items-center justify-center gap-5">
      <p className="text-center text-xl">
        {sessionData && (
          <span className="text-primary-content">
            {sessionData.user?.email}
          </span>
        )}
      </p>
      <button
        className="btn-primary btn rounded-full"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

function Layout({ children }: Props) {
  const router = useRouter();
  const isAuthRoute =
    router.pathname === "/auth/login" || router.pathname === "/auth/register";

  const isAppRoute = Object.keys(router.query).length > 0;

  if (isAuthRoute) return <>{children}</>;

  return (
    <>
      <Head>
        <title>Todo App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex h-screen flex-col">
        <header>
          <div
            className={`flex w-screen ${
              isAppRoute ? "justify-between" : "justify-end"
            } bg-base-200 p-2`}
          >
            {isAppRoute && (
              <div className="btn" onClick={() => router.push("/app")}>
                back
              </div>
            )}
            <div className="mr-4">
              <AuthBtn />
            </div>
          </div>
        </header>
        <main className="flex flex-grow flex-col">{children}</main>
      </div>
    </>
  );
}

export default Layout;
