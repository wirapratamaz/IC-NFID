import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function WelcomePanel() {
  return (
    <Card className="w-[90vw] max-w-screen-2xl mb-8">
      <CardHeader>
        <CardTitle>👋 Welcome to HoodFunt!</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
