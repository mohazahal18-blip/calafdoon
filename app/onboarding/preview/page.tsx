import { createClient } from "@/lib/supabase/server";
import { finishOnboarding } from "../actions";

export default async function PreviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, birth_date, city, country, about_me, photos(url, is_primary)")
    .eq("user_id", user?.id)
    .single();

  const age = profile?.birth_date
    ? Math.floor((Date.now() - new Date(profile.birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : null;
  const photo = profile?.photos?.find((p: { is_primary: boolean }) => p.is_primary)?.url;

  return (
    <>
      <h1>This is what people will see</h1>
      <p className="onboarding-sub">You can always edit your profile later from Settings.</p>

      <div className="profile-preview-card">
        {photo && <img src={photo} alt="" className="profile-preview-photo" />}
        <h2>
          {profile?.first_name}{age ? `, ${age}` : ""}
        </h2>
        <p className="profile-preview-location">
          {[profile?.city, profile?.country].filter(Boolean).join(", ")}
        </p>
        <p className="profile-preview-about">{profile?.about_me}</p>
      </div>

      <form action={finishOnboarding} className="onboarding-form">
        <button type="submit">Start discovering</button>
      </form>
    </>
  );
}
