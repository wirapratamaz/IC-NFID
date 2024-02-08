"use client";

import Editor from "@monaco-editor/react";
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

type PasteProps = {
  paste: Paste;
  ownerProfile: Profile | null;
};

export function PasteCard({ paste, ownerProfile }: PasteProps) {
  const { theme } = useTheme();

  return (
    <Card className="w-[90vw] max-w-screen-2xl">
      <CardHeader>
        <CardTitle>
          <div className="w-full flex items-center justify-between gap-4">
            <h1>{paste.title}</h1>
            <CopyLink />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Editor
          height={200}
          className="rounded-md"
          defaultLanguage={paste.language}
          theme={theme == "dark" ? "vs-dark" : "vs-light"}
          value={paste.content}
          options={{
            domReadOnly: true,
            minimap: { enabled: false },
            formatOnType: true,
            scrollBeyondLastLine: false,
            roundedSelection: false,
            fontSize: 14,
            tabSize: 2,
            readOnly: true,
          }}
        />
      </CardContent>
      <CardFooter>
        {ownerProfile && (
          <div className="flex flex-row items-center">
            <Avatar profile={ownerProfile} />
            <strong className="ml-2">@{ownerProfile.username}</strong>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
