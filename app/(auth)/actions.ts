"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { error: string } | never;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUp(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult | { error: string }> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!isValidEmail(email)) {
    return { error: "Enter a valid email address." };
  }
  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    // Supabase already de-dupes signups; surface a generic message either way
    // so we don't confirm which emails are registered.
    return { error: error.message };
  }

  // The `users` app-table row is created by a Postgres trigger on
  // auth.users insert (see supabase/migrations — add a handle_new_user
  // trigger there before going live) so no extra insert is needed here.

  if (data.session) {
    redirect("/onboarding/basic-info");
  }

  // Email confirmation required before a session exists.
  redirect("/signup/check-email");
}

export async function logIn(
  _prevState: unknown,
  formData: FormData
): Promise<{ error: string } | never> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/discover");

  if (!isValidEmail(email) || password.length === 0) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Incorrect email or password." };
  }

  redirect(next);
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
