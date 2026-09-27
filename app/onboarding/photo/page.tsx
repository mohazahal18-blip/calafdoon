"use client";

import { useActionState, useState } from "react";
import { savePhoto } from "../actions";

const initialState = { error: "" };

export default function PhotoPage() {
  const [state, formAction, isPending] = useActionState(savePhoto, initialState);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <>
      <h1>Add your photo</h1>
      <p className="onboarding-sub">
        Profiles with a clear, recent photo get far more genuine matches. Your
        photo is reviewed before it's shown to anyone.
      </p>

      <form action={formAction} className="onboarding-form">
        <label htmlFor="photo" className="photo-drop">
          {preview ? (
            <img src={preview} alt="Selected preview" className="photo-preview" />
          ) : (
            <span>Tap to choose a photo</span>
          )}
          <input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            required
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </label>

        {state?.error && <p role="alert" className="auth-error">{state.error}</p>}

        <button type="submit" disabled={isPending}>{isPending ? "Uploading…" : "Continue"}</button>
      </form>
    </>
  );
}
