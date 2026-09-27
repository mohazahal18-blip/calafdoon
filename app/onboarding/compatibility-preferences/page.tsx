"use client";

import { useActionState } from "react";
import { saveCompatibilityPreferences } from "../actions";
import { LANGUAGE_OPTIONS } from "@/lib/onboarding/options";

const initialState = { error: "" };

export default function CompatibilityPreferencesPage() {
  const [state, formAction, isPending] = useActionState(saveCompatibilityPreferences, initialState);

  return (
    <>
      <h1>A few more details</h1>
      <p className="onboarding-sub">These fine-tune your compatibility score — none of them are dealbreakers on their own.</p>

      <form action={formAction} className="onboarding-form">
        <fieldset>
          <legend>Preferred languages (optional)</legend>
          <div className="chip-grid">
            {LANGUAGE_OPTIONS.map((lang) => (
              <label key={lang} className="chip">
                <input type="checkbox" name="preferred_languages" value={lang} />
                {lang}
              </label>
            ))}
          </div>
        </fieldset>

        <label htmlFor="education_pref">Education preference (optional)</label>
        <input id="education_pref" name="education_pref" type="text" placeholder="e.g. University-educated" />

        <fieldset>
          <legend>Wants children</legend>
          <select name="wants_children" defaultValue="no_preference">
            <option value="no_preference">No preference</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="open">Open to it</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Smoking</legend>
          <select name="smoking" defaultValue="no_preference">
            <option value="no_preference">No preference</option>
            <option value="non_smoker">Prefer non-smoker</option>
            <option value="okay">Doesn't matter</option>
          </select>
        </fieldset>

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
