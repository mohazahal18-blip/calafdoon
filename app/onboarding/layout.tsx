"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ONBOARDING_STEPS, stepIndex, prevStepPath } from "@/lib/onboarding/steps";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname.split("/").pop() ?? "";
  const index = stepIndex(currentPath);
  const total = ONBOARDING_STEPS.length;
  const current = index === -1 ? 1 : index + 1;
  const percent = Math.round((current / total) * 100);
  const back = prevStepPath(currentPath);

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        {back ? (
          <Link href={back} className="onboarding-back" aria-label="Go back">
            ←
          </Link>
        ) : (
          <span />
        )}
        <span className="onboarding-step-count">
          Step {current} of {total}
        </span>
      </header>

      <div className="progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>

      <main className="onboarding-content">{children}</main>
    </div>
  );
}
