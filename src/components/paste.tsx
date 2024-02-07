"use client";
import Editor from "@monaco-editor/react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function Paste() {
  return (
    <Card className="w-[800px]">
      <CardHeader>
        <CardTitle>Paste #12312412</CardTitle>
        <CardDescription>Created just now</CardDescription>
      </CardHeader>
      <CardContent>
        <Editor
          height={300}
          theme="vs-dark"
          className="rounded-md"
          defaultLanguage="javascript"
          defaultValue={
            "console.log('Hackaton ready! Cool shit is coming soon!');\n\n\n"
          }
          options={{
            domReadOnly: true,
            readOnly: true,
            minimap: { enabled: false },
            formatOnType: true,
            scrollBeyondLastLine: false,
            roundedSelection: false,
            fontSize: 16,
          }}
        />
      </CardContent>
    </Card>
  );
}
