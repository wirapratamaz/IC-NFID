"use client";

import { ClipboardCopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useState } from "react";

export function CopyLink() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (copied) return;
    // copy page url to clipboard
    window.navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <Button className="w-32" onClick={() => handleCopy()} disabled={copied}>
      {copied ? (
        "Copied!"
      ) : (
        <>
          <ClipboardCopyIcon className="mr-2 h-4 w-4" />
          Copy Link
        </>
      )}
    </Button>
  );
}
