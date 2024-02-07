"use client";

type ProvidersProps = {
  children: React.ReactNode;
};

import { RecoilRoot, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import {
  type Doc,
  initJuno,
  setDoc,
  authSubscribe,
  User,
} from "@junobuild/core-peer";
import { authState } from "@/atoms/auth";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider } from "next-themes";

function JunoAuthProvider({ children }: ProvidersProps) {
  const [user, setUser] = useRecoilState(authState);

  useEffect(() => {
    const unsubscribe = authSubscribe((user: User | null) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "rluun-eqaaa-aaaal-adrsa-cai",
      }))();
  }, []);

  return (
    <RecoilRoot>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        disableTransitionOnChange
      >
        <JunoAuthProvider>{children}</JunoAuthProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
