"use client";

import CodeEditor from "@uiw/react-textarea-code-editor";
import { useTheme } from "next-themes";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Paste } from "@/atoms/paste";
import { Profile } from "@/atoms/profile";
import { Avatar } from "./avatar";
import { CopyLink } from "./copy-link";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { Input } from "./ui/input";
import { useState } from "react";
import CryptoJS from "crypto-js";
import { Separator } from "./ui/separator";

type PasteProps = {
  paste: Paste;
  ownerProfile: Profile | null;
};

export function PasteCard({ paste, ownerProfile }: PasteProps) {
  const { theme } = useTheme();

  const [passcode, setPasscode] = useState("");

  console.log(paste);

  let content = paste.content;
  if (paste.isEncrypted) {
    const bytes = CryptoJS.AES.decrypt(
      paste.content,
      (paste.cypherSeed as string) + passcode
    );

    try {
      content = bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      content = "[DECRYPTED]";
    }
  }

  return (
    <Card className="w-[90vw] max-w-screen-2xl">
      <CardHeader>
        <CardTitle>
          <div className="w-full flex items-center justify-between gap-4">
            <h1 className="flex flex-row items-center gap-2">
              {paste.isEncrypted && <LockClosedIcon className="w-6 h-6" />}
              {paste.title || "Untitled Paste"}
            </h1>
            <CopyLink />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {paste.isEncrypted && (
          <>
            <Input
              type="text"
              placeholder="This paste is encrypted. Enter the passcode."
              className="font-mono mb-4"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
            />
          </>
        )}

        <div className="border rounded-md">
          <CodeEditor
            value={content}
            language={paste.language}
            padding={15}
            data-color-mode={theme === "dark" ? "dark" : "light"}
            readOnly={true}
            style={{
              borderRadius: "5px",
              background: "transparent",
              fontFamily: "monospace",
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-row items-center gap-2 justify-between text-foreground/80">
          <span>Published by:</span>
          {ownerProfile ? (
            <>
              <Avatar profile={ownerProfile} />
              <strong>@{ownerProfile.username}</strong>
            </>
          ) : (
            <>Anonymous</>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
