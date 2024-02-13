"use client";

import { Profile, createOrUpdateProfile, profileState } from "@/atoms/profile";
import useBackground, { getRandomColor } from "@/hooks/use-background";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRecoilState } from "recoil";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { getDoc, setDoc } from "@junobuild/core-peer";
import { Textarea } from "../ui/textarea";
import { create } from "domain";
import { useToast } from "../ui/use-toast";

type Props = {
  profile: Profile | null;
  authKey: string;
  timezone?: string;
  currency?: string;
};

export function ProfileForm({ profile, authKey }: Props) {
  const { toast } = useToast();

  const [, setProfile] = useRecoilState(profileState);

  const [backgroundColor, setBackgroundColor] = useState<string>(
    profile?.color || getRandomColor()
  );
  const [seed, setSeed] = useState<string>(new Date().toJSON());
  const [avatarSvg, setAvatarSvg] = useState<string>(
    profile?.avatarSvg || genAvatar(seed)
  );
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

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setSaving(true);

    let newProfile: Profile = {
      ...data,
      avatarSvg,
      color: backgroundColor,
    };

    try {
      await createOrUpdateProfile(authKey, newProfile);
      setProfile(newProfile);
      toast({
        title: "Profile succesfully saved 🎉",
      });
    } catch (e) {
      console.error(e);
      toast({
        title: "Error saving profile 😢. Try again",
      });
    }
    setSaving(false);
  }

  const formSchema = z.object({
    username: z
      .string()
      .min(3, { message: "should be at least 3 characters long" })
      .max(15, { message: "should be <= 15 characters long" }),
    bio: z.string().max(160, { message: "should be <= 160 characters long" }),
    timezone: z.string(), // Added 'timezone' property
    currency: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username ?? "",
      bio: profile?.bio ?? "",
      timezone: profile?.timezone ?? "",
      currency: profile?.currency ?? "",
    },
  });

  return (
    <Card className="w-[90vw] max-w-sm mb-8">
      <CardHeader>
        <CardTitle className="text-center">
          Let&apos;s set up your profile
        </CardTitle>
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="" {...field} disabled={saving} />
                  </FormControl>
                  <FormDescription>
                    A few words about yourself. You may leave it blank.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="timezone"
                      render={({ field }) => (
                        <Select {...field}>
                          <SelectTrigger className="w-[280px]">
                            <SelectValue value={field.value} placeholder="Select a timezone" style={{ color: 'black' }} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>North America</SelectLabel>
                              <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                              <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                              <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                              <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                              <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                              <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Europe & Africa</SelectLabel>
                              <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                              <SelectItem value="cet">Central European Time (CET)</SelectItem>
                              <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
                              <SelectItem value="west">
                                Western European Summer Time (WEST)
                              </SelectItem>
                              <SelectItem value="cat">Central Africa Time (CAT)</SelectItem>
                              <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Asia</SelectLabel>
                              <SelectItem value="msk">Moscow Time (MSK)</SelectItem>
                              <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                              <SelectItem value="cst_china">China Standard Time (CST)</SelectItem>
                              <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                              <SelectItem value="kst">Korea Standard Time (KST)</SelectItem>
                              <SelectItem value="ist_indonesia">
                                Indonesia Central Standard Time (WITA)
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Australia & Pacific</SelectLabel>
                              <SelectItem value="awst">
                                Australian Western Standard Time (AWST)
                              </SelectItem>
                              <SelectItem value="acst">
                                Australian Central Standard Time (ACST)
                              </SelectItem>
                              <SelectItem value="aest">
                                Australian Eastern Standard Time (AEST)
                              </SelectItem>
                              <SelectItem value="nzst">New Zealand Standard Time (NZST)</SelectItem>
                              <SelectItem value="fjt">Fiji Time (FJT)</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>South America</SelectLabel>
                              <SelectItem value="art">Argentina Time (ART)</SelectItem>
                              <SelectItem value="bot">Bolivia Time (BOT)</SelectItem>
                              <SelectItem value="brt">Brasilia Time (BRT)</SelectItem>
                              <SelectItem value="clt">Chile Standard Time (CLT)</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Please set your region timezone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Controller
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <Select {...field}>
                          <SelectTrigger className="w-[280px]">
                            <SelectValue value={field.value} placeholder="Select a currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="IDR">IDR</SelectItem>
                              <SelectItem value="AUD">AUD</SelectItem>
                              <SelectItem value="JPY">JPY</SelectItem>
                              <SelectItem value="SGD">SGD</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Please set your currency.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
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
