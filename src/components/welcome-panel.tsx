import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function WelcomePanel() {
  return (
    <Card className="w-[90vw] max-w-screen-2xl mb-8">
      <CardHeader>
        <CardTitle>👋 Welcome to Paste!</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 leading-6">
          <p>Paste is a simple, fast, and secure way to share text online.</p>
          <p>
            This platform is hosted on{" "}
            <a
              href="https://internetcomputer.org/"
              target="_blank"
              className="text-indigo-500 underline underline-offset-4"
            >
              Internet computer
            </a>
            , a decentralized network that puts the internet back into the hands
            of the people. All your paste data is stored on the internet
            computer and is free from any centralized control.
          </p>
          <p className="mt-6">
            Developed on sunny Bali island by{" "}
            <a
              href="https://github.com/CodingFu"
              className="text-indigo-500 underline underline-offset-4"
            >
              @CodingFu
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
