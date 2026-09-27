"use client";

import { useActionState } from "react";
import { saveAboutMe } from "../actions";

const initialState = { error: "" };

export default function AboutMePage() {
  const [state, formAction, isPending] = useActionState(saveAboutMe, initialState);

  return (
    <>
      <h1>Tell people about yourself</h1>
      <p className="onboarding-sub">A couple of honest sentences goes further than a perfect bio.</p>

      <form action={formAction} className="onboarding-form">
        <label htmlFor="about_me">About me</label>
        <textarea id="about_me" name="about_me" rows={5} minLength={20} required />

        <label htmlFor="education">Education (optional)</label>
        <input id="education" name="education" type="text" placeholder="e.g. BSc Computer Science" />

        <label htmlFor="career">Career (optional)</label>
        <input id="career" name="career" type="text" placeholder="e.g. Software Engineer" />

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
