"use client";

import { Paste } from "@/components/paste";
import useBackground from "@/hooks/use-background";
import Image from "next/image";

export default function Home() {
  useBackground();

  return (
    <div>
      <Paste></Paste>
    </div>
  );
}
