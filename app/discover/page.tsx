import { createClient } from "@/lib/supabase/server";
import { logOut } from "../(auth)/actions";

// Placeholder only — the real discovery feed, compatibility scoring, and
// likes/matches are Phase 2 (see the product blueprint). This page just
// confirms the account + onboarding pipeline works end to end.
export default async function DiscoverPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("user_id", user?.id)
    .single();

  return (
    <main className="onboarding-page">
      <div className="onboarding-content">
        <h1>You're in, {profile?.first_name ?? "there"}.</h1>
        <p className="onboarding-sub">
          Your profile is saved. The discovery feed and matching are being
          built next — check back soon.
        </p>
        <form action={logOut} className="onboarding-form">
          <button type="submit">Log out</button>
        </form>
      </div>
    </main>
  );
}
