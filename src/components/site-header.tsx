"use client";

import { useRecoilState } from "recoil";
import { MainMenuToggle } from "./main-menu-toggle";
import { authState } from "@/atoms/auth";
import { profileState } from "@/atoms/profile";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { EnvelopeOpenIcon } from "@radix-ui/react-icons";

export function SiteHeader() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold inline-block">
              <span className="mr-2">🍔</span>
              HoodFunt.
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm"></nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center gap-4">
            <MainMenuToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
