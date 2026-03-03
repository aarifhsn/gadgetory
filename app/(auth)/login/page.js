import { auth } from "@/auth";
import LoginContent from "@/components/auth/LoginContent";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return (
    <>
      <LoginContent />
    </>
  );
}
