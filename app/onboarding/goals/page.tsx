"use client";

import { useActionState } from "react";
import { saveGoals } from "../actions";
import { RELATIONSHIP_INTENTION_OPTIONS } from "@/lib/onboarding/options";

const initialState = { error: "" };

export default function GoalsPage() {
  const [state, formAction, isPending] = useActionState(saveGoals, initialState);

  return (
    <>
      <h1>What are you looking for?</h1>
      <p className="onboarding-sub">Be honest — this is what we'll match you on.</p>

      <form action={formAction} className="onboarding-form">
        <fieldset>
          <legend>Relationship goal</legend>
          {RELATIONSHIP_INTENTION_OPTIONS.map((opt) => (
            <label key={opt.value} className="radio">
              <input type="radio" name="relationship_intention" value={opt.value} required />
              {opt.label}
            </label>
          ))}
        </fieldset>

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
