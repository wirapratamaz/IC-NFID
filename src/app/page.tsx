"use client";

import { Paste, fetchPaste } from "@/atoms/paste";
import { Profile, fetchProfile } from "@/atoms/profile";
import { HoodMap } from "@/components/hood-map";
import WelcomePanel from "@/components/welcome-panel";
import useBackground from "@/hooks/use-background";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { set } from "react-hook-form";

export default function NewPage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [color, setColor] = useState<string>("");
  const [paste, setPaste] = useState<Paste | null>(null);
  const [pasteOwnerProfile, setPasteOwnerProfile] = useState<Profile | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useBackground(pasteOwnerProfile?.color);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");

    async function loadUp(key: string) {
      setLoading(true);
      try {
        const paste = await fetchPaste(key);
        if (paste) {
          setPaste(paste.data);

          if (paste.owner) {
            const profile = await fetchProfile(paste.owner);
            if (profile) {
              setPasteOwnerProfile(profile.data);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }

    if (p) {
      setId(p);
      loadUp(p);
    } else {
      setLoading(false);
      // router.push("/new");
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <HoodMap />
    </div>
  );
}
