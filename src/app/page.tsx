"use client";

import { Paste } from "@/components/paste-form";
import WelcomePanel from "@/components/welcome-panel";
import useBackground from "@/hooks/use-background";
import Image from "next/image";

export default function Home() {
  useBackground();

  return (
    <div>
      <WelcomePanel></WelcomePanel>
      <Paste></Paste>
    </div>
  );
}
