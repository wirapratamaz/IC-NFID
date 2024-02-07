"use client";

import { Paste } from "@/components/paste";
import useBackground from "@/hooks/useBackground";
import Image from "next/image";

export default function Home() {
  useBackground();

  return (
    <div>
      <Paste></Paste>
    </div>
  );
}
