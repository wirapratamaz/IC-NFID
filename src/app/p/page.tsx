"use client";

import useBackground from "@/hooks/use-background";
import { useEffect, useState } from "react";

export default function NewPage() {
  const [id, setId] = useState<string | null>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const _id = params.get("id");
    setId(_id);
  }, []);
  useBackground();
  return <div>ID: {id}</div>;
}
