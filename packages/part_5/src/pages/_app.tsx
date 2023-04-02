import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import { MantineProvider } from "@mantine/core";
import Layout from "../components/Layout";
import { useMediaQuery } from "@mantine/hooks";
import { useState, useEffect } from "react";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [dark, setDark] = useState(false);

  const preferredColorScheme = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    setDark(preferredColorScheme);
  }, [preferredColorScheme]);

  return (
    <SessionProvider session={session}>
      <MantineProvider theme={{ colorScheme: dark ? "dark" : "light" }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <Toaster />
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
