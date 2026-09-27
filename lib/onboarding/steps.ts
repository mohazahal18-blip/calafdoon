export type OnboardingStep = {
  path: string;
  label: string;
};

// Step 1 ("Create account") already happened via /signup.
// This list drives the progress bar and the next/back links for steps 2–10.
export const ONBOARDING_STEPS: OnboardingStep[] = [
  { path: "basic-info", label: "Basic info" },
  { path: "photo", label: "Photo" },
  { path: "about-me", label: "About me" },
  { path: "interests", label: "Interests" },
  { path: "goals", label: "Relationship goals" },
  { path: "preferences", label: "Preferences" },
  { path: "compatibility-preferences", label: "Compatibility" },
  { path: "preview", label: "Preview" },
];

export function stepIndex(path: string): number {
  return ONBOARDING_STEPS.findIndex((s) => s.path === path);
}

export function nextStepPath(path: string): string {
  const i = stepIndex(path);
  if (i === -1 || i === ONBOARDING_STEPS.length - 1) return "/discover";
  return `/onboarding/${ONBOARDING_STEPS[i + 1].path}`;
}

export function prevStepPath(path: string): string | null {
  const i = stepIndex(path);
  if (i <= 0) return null;
  return `/onboarding/${ONBOARDING_STEPS[i - 1].path}`;
}
