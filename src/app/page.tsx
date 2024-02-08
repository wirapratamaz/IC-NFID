"use client";

import { profileState } from "@/atoms/profile";
import { Paste } from "@/components/paste-form";
import WelcomePanel from "@/components/welcome-panel";
import useBackground from "@/hooks/use-background";
import { useRecoilState } from "recoil";

export default function Home() {
  const [profile, setProfile] = useRecoilState(profileState);
  useBackground(profile?.color);

  return (
    <div>
      {/* <WelcomePanel></WelcomePanel> */}
      <Paste></Paste>
    </div>
  );
}
