"use client";

import { useActionState } from "react";
import { saveBasicInfo } from "../actions";

const initialState = { error: "" };

export default function BasicInfoPage() {
  const [state, formAction, isPending] = useActionState(saveBasicInfo, initialState);

  return (
    <>
      <h1>The basics</h1>
      <p className="onboarding-sub">This is what other people will see first.</p>

      <form action={formAction} className="onboarding-form">
        <label htmlFor="first_name">First name</label>
        <input id="first_name" name="first_name" type="text" required />

        <label htmlFor="birth_date">Date of birth</label>
        <input id="birth_date" name="birth_date" type="date" required />

        <fieldset>
          <legend>Gender</legend>
          <label className="radio"><input type="radio" name="gender" value="female" required /> Woman</label>
          <label className="radio"><input type="radio" name="gender" value="male" /> Man</label>
        </fieldset>

        <label htmlFor="country">Country</label>
        <input id="country" name="country" type="text" placeholder="e.g. United Kingdom" required />

        <label htmlFor="city">City (optional)</label>
        <input id="city" name="city" type="text" />

        <label htmlFor="nationality">Cultural background (optional)</label>
        <input id="nationality" name="nationality" type="text" placeholder="e.g. Somali" />

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Saving…" : "Continue"}</button>
      </form>
    </>
  );
}
