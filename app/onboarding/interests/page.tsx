"use client";

import { useActionState } from "react";
import { saveInterests } from "../actions";
import { INTEREST_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/onboarding/options";

const initialState = { error: "" };

export default function InterestsPage() {
  const [state, formAction, isPending] = useActionState(saveInterests, initialState);

  return (
    <>
      <h1>Languages & interests</h1>
      <p className="onboarding-sub">This helps us find people you'll actually have things to talk about with.</p>

      <form action={formAction} className="onboarding-form">
        <fieldset>
          <legend>Languages you speak</legend>
          <div className="chip-grid">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label key={lang} className="chip">
                <input type="checkbox" name="languages" value={lang} />
                {lang}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Interests</legend>
          <div className="chip-grid">
            {INTEREST_OPTIONS.map((interest) => (
              <label key={interest} className="chip">
                <input type="checkbox" name="interests" value={interest} />
                {interest}
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
