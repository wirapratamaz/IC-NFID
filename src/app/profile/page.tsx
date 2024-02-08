"use client";

import { useRecoilState } from "recoil";
import { authState } from "@/atoms/auth";
import { fetchProfile, profileState } from "@/atoms/profile";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useBackground from "@/hooks/use-background";
import { ProfileForm } from "@/components/forms/profile-form";
import { Loading } from "@/components/loading";

export default function ProfilePage() {
  const [auth, setAuth] = useRecoilState(authState);
  const [profile, setProfile] = useRecoilState(profileState);
  const [loading, setLoading] = useState<boolean>(true);

  useBackground();

  useEffect(() => {
    if (!auth) {
      return;
    }

    async function loadProfile(k: string) {
      const profile = await fetchProfile(k);
      setProfile(profile?.data || null);
      setLoading(false);
    }

    loadProfile(auth.key);
  }, [auth, setProfile, setLoading]);

  if (loading) {
    return <Loading />;
  }

  return <ProfileForm profile={profile} authKey={auth?.key as string} />;
}
