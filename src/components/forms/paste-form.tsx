"use client";

import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import CodeEditor from "@uiw/react-textarea-code-editor";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast, useToast } from "@/components/ui/use-toast";

import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { LANGUAGE_OPTS } from "@/lib/constants";
import { CaretSortIcon, CheckIcon, ReloadIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { use, useEffect, useState } from "react";
import { createPaste } from "@/atoms/paste";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { profileState } from "@/atoms/profile";

const formSchema = z.object({
  title: z.string().max(50),
  language: z.string(),
});

type TitleInputProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  saving: boolean;
};
function TitleInput({ form, saving }: TitleInputProps) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input
              placeholder="My spaghetti code"
              disabled={saving}
              {...field}
            />
          </FormControl>
          <FormDescription>You can leave it blank</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

type LanguageProps = {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  saving: boolean;
};

function LanguageDropdown({ form, saving }: LanguageProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name="language"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Language</FormLabel>
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild disabled={saving}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={saving}
                >
                  {field.value
                    ? LANGUAGE_OPTS.find(
                        (language) => language.value === field.value
                      )?.label
                    : "Select language"}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput
                  placeholder="Search framework..."
                  className="h-9"
                />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-scroll">
                  {LANGUAGE_OPTS.map((language) => (
                    <CommandItem
                      value={language.label}
                      key={language.value}
                      onSelect={() => {
                        form.setValue("language", language.value);
                        setPopoverOpen(false);
                      }}
                    >
                      {language.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          language.value === field.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function PasteForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [profile, setProfile] = useRecoilState(profileState);

  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);

  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      language: "plaintext",
    },
  });

  const language = form.watch("language");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!code) {
      return toast({
        title: "Please enter some code or text! 🤔",
        variant: "destructive",
      });
    }
    setSaving(true);
    try {
      const createdPaste = await createPaste(
        { ...values, content: code },
        profile?.username ? `@${profile.username}` : "anonymous"
      );
      if (!createdPaste) {
        throw new Error("Failed to save paste");
      }

      toast({
        title: "Paste saved successfully! 🎉",
      });
      router.push(`/?p=${createdPaste.key}`);
    } catch (e) {
      console.error(e);
      toast({
        title: "Error saving paste 😢. Try again",
        variant: "destructive",
      });
    }
    setSaving(false);
  }

  return (
    <Card className="w-[90vw] max-w-screen-2xl">
      <CardHeader>
        <CardTitle>Create a new paste!</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-4">
              <TitleInput form={form} saving={saving} />
              <LanguageDropdown form={form} saving={saving} />
              <FormItem>
                <FormLabel>Your code (or top secret message 🤐)</FormLabel>
                <div className="border rounded-md">
                  <CodeEditor
                    value={code}
                    language={language}
                    onChange={(e) => setCode(e.target.value)}
                    padding={15}
                    data-color-mode={theme === "dark" ? "dark" : "light"}
                    readOnly={saving}
                    style={{
                      borderRadius: "5px",
                      background: "transparent",
                      fontFamily: "monospace",
                    }}
                  />
                </div>
              </FormItem>
              {!profile && (
                <FormDescription>
                  You are not logged in. that means your paste will be public
                  and you will not be able to edit or delete it later.
                </FormDescription>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span> Publish unstoppable paste!
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
