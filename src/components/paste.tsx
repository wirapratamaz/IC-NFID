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
        <CardDescription>Created 7 years ago</CardDescription>
      </CardHeader>
      <CardContent>
        <Editor
          height={300}
          theme="vs-dark"
          className="rounded-md"
          defaultLanguage="javascript"
          defaultValue={"console.log('Hello, world!');\n\n\nclass Test {}"}
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
