import { redirect } from "next/navigation";
import SignInPage from "./signin";
import { checkIsAuthenticated } from "@/app/api/auth/checkIsAuthenticated";
import { auth } from "@/app/api/auth/authConfig";

export default async function SignIn() {
  const isAuthenticated = await checkIsAuthenticated();

  const session = await auth();
  const user = session?.user;

  if (isAuthenticated) {
    redirect("/dashboard");
  }
  return <SignInPage />;
}
