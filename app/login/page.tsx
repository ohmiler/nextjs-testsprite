import { redirect } from "next/navigation";

import { loginAction } from "@/app/actions/auth";
import { AuthForm } from "@/components/auth-form";
import { getCurrentUser } from "@/lib/auth";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
      <AuthForm action={loginAction} mode="login" />
    </main>
  );
}