"use client";

import { useRecoilState } from "recoil";
import { ModeToggle } from "./mode-toggle";
import { authState } from "@/atoms/auth";
import { profileState } from "@/atoms/profile";
import { NFIDProvider, signIn } from "@junobuild/core-peer";

export function SiteHeader() {
  const [auth, setAuth] = useRecoilState(authState);
  const [profile, setProfile] = useRecoilState(profileState);

  console.log("header profile", profile);

  async function handleLogin() {
    await signIn({
      provider: new NFIDProvider({
        appName: "paste.digital",
        logoUrl: "https://somewhere.com/your_logo.png",
      }),
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold inline-block">
              <span className="mr-2">📋</span>
              paste.digital
            </span>
          </a>
          <nav className="flex items-center gap-6 text-sm">
            {/* <a
              className="transition-colors hover:text-foreground/80 text-foreground/60"
              href="/new"
            >
              NEW
            </a> */}
          </nav>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <nav className="flex items-center gap-4">
            {auth ? (
              <>
                {profile && (
                  <button
                    className="w-8 h-8 rounded-md"
                    dangerouslySetInnerHTML={{ __html: profile.avatarSvg }}
                    style={{ backgroundColor: profile.color }}
                  ></button>
                )}
                <button
                  className="transition-colors hover:text-foreground text-foreground/80"
                  onClick={() => setAuth(null)}
                >
                  Log out
                </button>
              </>
            ) : (
              <button
                className="transition-colors hover:text-foreground text-foreground/80"
                onClick={handleLogin}
              >
                Authenicate
                <span className="ml-2">🔑</span>
              </button>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
