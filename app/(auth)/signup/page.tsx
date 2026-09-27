"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signUp } from "../actions";

const initialState = { error: "" };

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create your account</h1>
        <p className="auth-sub">
          Already have one?{" "}
          <Link href="/login">Log in</Link>
        </p>

        <form action={formAction} noValidate>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />

          {state?.error && (
            <p role="alert" className="auth-error">
              {state.error}
            </p>
          )}

          <button type="submit" disabled={isPending}>
            {isPending ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-legal">
          By creating an account you agree to CALAFDOON's{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>. You must be 18 or older.
        </p>
      </div>
    </main>
  );
}
