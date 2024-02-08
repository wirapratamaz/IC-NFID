"use client";

import { profileState } from "@/atoms/profile";
import { PasteForm } from "@/components/forms/paste-form";
import WelcomePanel from "@/components/welcome-panel";
import useBackground from "@/hooks/use-background";
import { useRecoilState } from "recoil";

export default function Home() {
  const [profile, setProfile] = useRecoilState(profileState);
  useBackground(profile?.color);

  return (
    <div>
      <PasteForm></PasteForm>
    </div>
  );
}
