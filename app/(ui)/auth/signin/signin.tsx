"use client";

import { useState, useTransition } from "react";
import { handleEmailSignIn } from "@/app/api/auth/emailSignInServerAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page, allowing us to handle the submission in TypeScript.

    setIsLoading(true);
    setMessage(null);
    startTransition(async () => {
      try {
        await handleEmailSignIn(email);
        setMessage({
          type: "success",
          text: "Magic link sent! Check your email.",
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Failed to send magic link. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">AI Login</CardTitle>
          <CardDescription>
            <p>Enter your email to receive a magic link.</p>
            <p>(For new users, this will create a new account.)</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            className="w-full"
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "Sending..." : "Send Magic Link"}
          </Button>
          {message && (
            <Alert
              variant={message.type === "success" ? "default" : "destructive"}
              className="mt-4 dark:bg-gray-300"
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {message.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
