import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function AuthSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-black">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="text-center text-2xl">AI Login</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={"default"} className="mt-4">
            <CheckCircle className="h-4 w-4" color="green" />

            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>
              Magic link sent! Check your email
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col"></CardFooter>
      </Card>
    </div>
  );
}
