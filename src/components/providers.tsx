"use client";

type ProvidersProps = {
  children: React.ReactNode;
};

import { RecoilRoot, useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import {
  type Doc,
  initJuno,
} from "@junobuild/core-peer";
import { ThemeProvider } from "next-themes";

function JunoAuthProvider({ children }: ProvidersProps) {

  useEffect(() => {});

  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    (async () =>
      await initJuno({
        satelliteId: "n5isd-iaaaa-aaaal-adtra-cai",
      }))();
    setInitialized(true);
  }, []);

  if (!initialized) {
    return;
  }

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
