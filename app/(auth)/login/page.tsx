"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { logIn } from "../actions";

const initialState = { error: "" };

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/discover";
  const [state, formAction, isPending] = useActionState(logIn, initialState);

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-sub">
          New here? <Link href="/signup">Create an account</Link>
        </p>
        <form action={formAction} noValidate>
          <input type="hidden" name="next" value={next} />
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="current-password" required />
          {state?.error && <p role="alert" className="auth-error">{state.error}</p>}
          <button type="submit" disabled={isPending}>
            {isPending ? "Logging in…" : "Log in"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
