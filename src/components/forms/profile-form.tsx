"use client";

import { Profile, createOrUpdateProfile, profileState } from "@/atoms/profile";
import useBackground, { getRandomColor } from "@/hooks/use-background";
import { openPeeps } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm} from "react-hook-form";
import { useRecoilState } from "recoil";
import { z } from "zod";
import { cn } from "@/lib/utils";
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";

type Props = {
  profile: Profile | null;
  authKey: string;
};

export function ProfileForm({ profile, authKey }: Props) {
  const { toast } = useToast();

  const [, setProfile] = useRecoilState(profileState);

  const currencies = [
    { label: "USD", value: "usd" },
    { label: "EUR", value: "eur" },
    { label: "JPY", value: "jpy" },
    { label: "IDR", value: "idr" },
    { label: "AUD", value: "aud" },
    { label: "CAD", value: "cad" },
    { label: "CHF", value: "chf" },
    { label: "CNY", value: "cny" },
    { label: "SEK", value: "sek" },
    { label: "NZD", value: "nzd" },
    // Add more currencies as needed
  ] as const;

  const timezones = [
    { label: 'Eastern Standard Time (EST)', value: 'est' },
  { label: 'Central Standard Time (CST)', value: 'cst' },
  { label: 'Mountain Standard Time (MST)', value: 'mst' },
  { label: 'Pacific Standard Time (PST)', value: 'pst' },
  { label: 'Alaska Standard Time (AKST)', value: 'akst' },
  { label: 'Hawaii Standard Time (HST)', value: 'hst' },
  { label: 'Greenwich Mean Time (GMT)', value: 'gmt' },
  { label: 'Central European Time (CET)', value: 'cet' },
  { label: 'Eastern European Time (EET)', value: 'eet' },
  { label: 'Western European Summer Time (WEST)', value: 'west' },
  { label: 'Central Africa Time (CAT)', value: 'cat' },
  { label: 'East Africa Time (EAT)', value: 'eat' },
  { label: 'Moscow Time (MSK)', value: 'msk' },
  { label: 'India Standard Time (IST)', value: 'ist' },
  { label: 'China Standard Time (CST)', value: 'cst_china' },
  { label: 'Japan Standard Time (JST)', value: 'jst' },
  { label: 'Korea Standard Time (KST)', value: 'kst' },
  { label: 'Indonesia Central Standard Time (WITA)', value: 'ist_indonesia' },
  { label: 'Australian Western Standard Time (AWST)', value: 'awst' }
  ] as const

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
    currency: z.string({
      required_error: "Currency is required",
    }),
    timezone: z.string({
      required_error: "Timezone is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username ?? "",
      bio: profile?.bio ?? "",
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
            {/* Timezone Field */}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Timezone</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? timezones.find(
                              (timezone) => timezone.value === field.value
                            )?.label
                            : "Select timezone"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 max-h-[200px] overflow-auto">
                      <Command>
                        <CommandInput placeholder="Search timezone..." />
                        <CommandEmpty>No timezone found.</CommandEmpty>
                        <CommandGroup>
                          {timezones.map((timezone) => (
                            <CommandItem
                              value={timezone.label}
                              key={timezone.value}
                              onSelect={() => {
                                form.setValue("timezone", timezone.value)
                              }}
                            >
                              {timezone.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the timezone that will be used in the dashboard.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Currency Field */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Currency</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? currencies.find(
                              (currency) => currency.value === field.value
                            )?.label
                            : "Select currency"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search currency..." />
                        <CommandEmpty>No currency found.</CommandEmpty>
                        <CommandGroup>
                          {currencies.map((currency) => (
                            <CommandItem
                              value={currency.label}
                              key={currency.value}
                              onSelect={() => {
                                form.setValue("currency", currency.value)
                              }}
                            >
                              {currency.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the currency that will be used in the dashboard.
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
