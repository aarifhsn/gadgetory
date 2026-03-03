"use server";
import { signIn } from "@/auth";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error?.type === "CredentialsSignin") {
      return { error: "Invalid email or password" };
    }

    return { error: "Something went wrong. Please try again." };
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}
