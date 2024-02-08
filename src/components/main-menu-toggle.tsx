"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { useRecoilState } from "recoil";
import { profileState } from "@/atoms/profile";
import { authState } from "@/atoms/auth";
import { NFIDProvider, signIn, signOut } from "@junobuild/core-peer";
import { useRouter } from "next/navigation";

export function MainMenuToggle() {
  const { setTheme } = useTheme();
  const [profile, setProfile] = useRecoilState(profileState);
  const [user, setUser] = useRecoilState(authState);
  const router = useRouter();

  async function handleLogin() {
    await signIn({
      provider: new NFIDProvider({
        appName: "paste.digital",
        logoUrl: "https://somewhere.com/your_logo.png",
      }),
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {profile ? (
            <div
              className="w-8 h-8 rounded-md"
              dangerouslySetInnerHTML={{ __html: profile.avatarSvg }}
              style={{ backgroundColor: profile.color }}
            ></div>
          ) : (
            <span className="text-xl">🚪</span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {profile ? (
          <>
            <DropdownMenuLabel>@{profile.username}</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              Profile
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => handleLogin()}>
              Login / Register
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Bright
                  <span className="ml-2">🌈</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                  <span className="ml-2">😈</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        {user && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut()}>
              Logout
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
