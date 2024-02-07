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
  getDoc,
} from "@junobuild/core-peer";
import { authState } from "@/atoms/auth";
import { ThemeProviderProps } from "next-themes/dist/types";
import { ThemeProvider } from "next-themes";
import { Profile, profileState } from "@/atoms/profile";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { set } from "zod";

function JunoAuthProvider({ children }: ProvidersProps) {
  const [user, setUser] = useRecoilState(authState);
  const [profile, setProfile] = useRecoilState<Profile | null>(profileState);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfileAndRedirect(u: User) {
      const _profile = await getDoc<Profile>({
        collection: "profiles",
        key: u.key,
      });

      console.log("fetched profile:", _profile);

      if (!_profile) {
        router.push("/profile");
      } else {
        setProfile(_profile.data);
      }
    }
    const unsubscribe = authSubscribe((user: User | null) => {
      setUser(user);
      console.log("got user", user);
      if (user) {
        fetchProfileAndRedirect(user);
      } else {
        setProfile(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {});

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
