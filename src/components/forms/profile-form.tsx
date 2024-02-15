"use client";

import { Profile, createOrUpdateProfile, profileState } from "@/atoms/profile";
import useBackground, { getRandomColor } from "@/hooks/use-background";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller, UseFormReturn } from "react-hook-form";
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
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type Props = {
  profile: Profile | null;
  authKey: string;
};

const formSchema = z.object({
  title: z.string().max(50),
  language: z.string(),
  isEncrypted: z.boolean(),
});

export function ProfileForm({ profile, authKey }: Props) {
  const { toast } = useToast();

  const [, setProfile] = useRecoilState(profileState);
  
  const [currencyOptions, setCurrencyOptions] = useState(["Pacific Standard Time (PST)", "Mountain Standard Time (MST)", "Central Standard Time (CST)", "Eastern Standard Time (EST)", "Alaska Standard Time (AKST)", "Hawaii Standard Time (HST)", "Greenwich Mean Time (GMT)", "Central European Time (CET)", "Eastern European Time (EET)", "Western European Summer Time (WEST)", "Central Africa Time (CAT)", "East Africa Time (EAT)", "Moscow Standard Time (MSK)", "Indian Standard Time (IST)", "China Standard Time (CST)", "Japan Standard Time (JST)", "Korea Standard Time (KST)", "Indonesia Central Time (ICT)", "Australian Western Standard Time (AWST)", "Australian Central Standard Time (ACST)", "Australian Eastern Standard Time (AEST)", "New Zealand Standard Time (NZST)", "Fiji Time (FJT)", "Argentina Time (ART)", "Bolivia Time (BOT)", "Brasília Time (BRT)", "Chile Standard Time (CLT)"]);
  const [newCurrency, setNewCurrency] = useState<string>('');
  const [timeZoneOptions, settimeZoneOptions] = useState(["USD", "IDR", "AUD", "JPY", "SGD"]);
  const [newtimeZone, setNewtimeZone] = useState<string>('');

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
      currency: data.currency,
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
    timezone: z.string().refine(value => timeZoneOptions.includes(value), {
      message: "Invalid timezone option",
    }),
    currency: z.string().refine(value => currencyOptions.includes(value), {
      message: "Invalid timezone option",
    }),
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
                            <SelectValue>{field.value}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {/* <SelectGroup>
                              {timezoneOptions.map((timezone) => (
                                <SelectItem key={timezone} value={timezone}>
                                  {timezone}
                                </SelectItem>
                              ))}
                            </SelectGroup> */}
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
                            <SelectValue>{field.value || "Select a currency"}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {currencyOptions.map((currency) => (
                                <SelectItem key={currency} value={currency}>
                                  {currency}
                                </SelectItem>
                              ))}
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
