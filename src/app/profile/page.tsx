"use client";

import { createAvatar } from "@dicebear/core";
import { openPeeps } from "@dicebear/collection";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useBackground, { getRandomColor } from "@/hooks/use-background";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRecoilState } from "recoil";
import { authState } from "@/atoms/auth";
import { profileState } from "@/atoms/profile";
import { setDoc } from "@junobuild/core-peer";
import { Profile } from "@/atoms/profile";

export default function ProfilePage() {
  const [auth, setAuth] = useRecoilState(authState);
  const [profile, setProfile] = useRecoilState(profileState);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    getRandomColor()
  );
  const [seed, setSeed] = useState<string>(new Date().toJSON());
  const [avatarSvg, setAvatarSvg] = useState<string>(genAvatar(seed));
  const [saving, setSaving] = useState<boolean>(false);
  useBackground(backgroundColor);

  function genAvatar(seed: string): string {
    return createAvatar(openPeeps, {
      seed: seed,
      backgroundColor: [backgroundColor],
    }).toString();
  }

  function handleRegenerate(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    e.preventDefault();
    setBackgroundColor(getRandomColor());
    const _newSeed = new Date().toJSON();
    setSeed(_newSeed);
    setAvatarSvg(genAvatar(seed));
  }

  const formSchema = z.object({
    username: z
      .string()
      .min(3, { message: "should be at least 3 characters long" })
      .max(15, { message: "should be <= 15 characters long" }),
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSaving(true);
    const newProfile: Profile = {
      username: data.username,
      avatarSvg,
      color: backgroundColor,
    };

    await setDoc<Profile>({
      collection: "profiles",
      doc: {
        key: auth!.key,
        description: "@" + data.username,
        data: newProfile,
      },
    });
    setProfile(newProfile);
    setSaving(false);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Card className="w-[90vw] max-w-sm mb-8">
      <CardHeader>
        <CardTitle className="text-center">Lets set up your profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4 items-center">
              <div
                className="w-48 h-48 rounded-lg mx-auto"
                style={{ backgroundColor }}
                dangerouslySetInnerHTML={{ __html: avatarSvg }}
              ></div>
              <Button variant="secondary" onClick={handleRegenerate}>
                <span className="mr-2"></span>
                Regenerate
              </Button>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="jacksparrow"
                      {...field}
                      disabled={saving}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This will be the name that others see you as. After once
                    set, it cannot be changed (at least for now).
                  </FormDescription>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <span className="mr-2">✅</span>
                  Save Profile
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
