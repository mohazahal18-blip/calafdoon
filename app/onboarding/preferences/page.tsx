"use client";

import { useActionState } from "react";
import { savePreferences } from "../actions";

const initialState = { error: "" };

export default function PreferencesPage() {
  const [state, formAction, isPending] = useActionState(savePreferences, initialState);

  return (
    <>
      <h1>Who would you like to meet?</h1>
      <p className="onboarding-sub">You can change these anytime in Settings.</p>

      <form action={formAction} className="onboarding-form">
        <fieldset>
          <legend>Show me</legend>
          <label className="chip"><input type="checkbox" name="preferred_genders" value="female" /> Women</label>
          <label className="chip"><input type="checkbox" name="preferred_genders" value="male" /> Men</label>
        </fieldset>

        <label htmlFor="age_min">Age range</label>
        <div className="age-range">
          <input id="age_min" name="age_min" type="number" min={18} max={99} defaultValue={22} required />
          <span>to</span>
          <input id="age_max" name="age_max" type="number" min={18} max={99} defaultValue={35} required />
        </div>

        <label htmlFor="preferred_locations">Preferred locations (optional)</label>
        <input
          id="preferred_locations"
          name="preferred_locations"
          type="text"
          placeholder="e.g. United Kingdom, Kenya"
        />
        <p className="field-hint">Separate multiple countries with commas. Leave blank for anywhere.</p>

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
