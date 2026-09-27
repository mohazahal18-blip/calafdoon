"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { nextStepPath } from "@/lib/onboarding/steps";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user: user! };
}

// ---------------------------------------------------------------------
// Step: basic-info
// ---------------------------------------------------------------------
export async function saveBasicInfo(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();

  const first_name = String(formData.get("first_name") ?? "").trim();
  const birth_date = String(formData.get("birth_date") ?? "");
  const gender = String(formData.get("gender") ?? "");
  const country = String(formData.get("country") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const nationality = String(formData.get("nationality") ?? "").trim();

  if (!first_name) return { error: "Enter your first name." };
  if (!birth_date) return { error: "Enter your date of birth." };

  const age = Math.floor(
    (Date.now() - new Date(birth_date).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  );
  if (age < 18) return { error: "You must be 18 or older to use CALAFDOON." };
  if (!["male", "female"].includes(gender)) return { error: "Select a gender." };
  if (!country) return { error: "Enter your country." };

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      first_name,
      birth_date,
      gender,
      country,
      city: city || null,
      nationality: nationality || null,
    },
    { onConflict: "user_id" }
  );

  if (error) return { error: "Couldn't save that — try again." };
  redirect(nextStepPath("basic-info"));
}

// ---------------------------------------------------------------------
// Step: photo
// ---------------------------------------------------------------------
export async function savePhoto(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const file = formData.get("photo") as File | null;

  if (!file || file.size === 0) return { error: "Choose a photo to continue." };
  if (file.size > 8 * 1024 * 1024) return { error: "Photo must be under 8MB." };
  if (!file.type.startsWith("image/")) return { error: "That file isn't an image." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Finish basic info first." };

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${profile.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-photos")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: "Upload failed — try a different photo." };

  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-photos").getPublicUrl(path);

  const { error: insertError } = await supabase.from("photos").insert({
    profile_id: profile.id,
    url: publicUrl,
    is_primary: true,
    position: 0,
  });
  if (insertError) return { error: "Couldn't save that — try again." };

  redirect(nextStepPath("photo"));
}

// ---------------------------------------------------------------------
// Step: about-me
// ---------------------------------------------------------------------
export async function saveAboutMe(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const about_me = String(formData.get("about_me") ?? "").trim();
  const education = String(formData.get("education") ?? "").trim();
  const career = String(formData.get("career") ?? "").trim();

  if (about_me.length < 20) {
    return { error: "Write at least a couple of sentences about yourself." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ about_me, education: education || null, career: career || null })
    .eq("user_id", user.id);

  if (error) return { error: "Couldn't save that — try again." };
  redirect(nextStepPath("about-me"));
}

// ---------------------------------------------------------------------
// Step: interests (also captures languages spoken)
// ---------------------------------------------------------------------
export async function saveInterests(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const interestNames = formData.getAll("interests").map(String);
  const languageNames = formData.getAll("languages").map(String);

  if (interestNames.length === 0) return { error: "Pick at least one interest." };
  if (languageNames.length === 0) return { error: "Pick at least one language." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Finish basic info first." };

  const { data: interestRows, error: interestErr } = await supabase
    .from("interests")
    .select("id, name")
    .in("name", interestNames);
  const { data: languageRows, error: languageErr } = await supabase
    .from("languages")
    .select("id, name")
    .in("name", languageNames);

  if (interestErr || languageErr) return { error: "Couldn't save that — try again." };

  await supabase.from("profile_interests").delete().eq("profile_id", profile.id);
  await supabase.from("profile_languages").delete().eq("profile_id", profile.id);

  if (interestRows?.length) {
    await supabase.from("profile_interests").insert(
      interestRows.map((i) => ({ profile_id: profile.id, interest_id: i.id }))
    );
  }
  if (languageRows?.length) {
    await supabase.from("profile_languages").insert(
      languageRows.map((l) => ({ profile_id: profile.id, language_id: l.id }))
    );
  }

  redirect(nextStepPath("interests"));
}

// ---------------------------------------------------------------------
// Step: goals
// ---------------------------------------------------------------------
export async function saveGoals(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const relationship_intention = String(formData.get("relationship_intention") ?? "");

  if (!["marriage", "serious_relationship", "open_to_both"].includes(relationship_intention)) {
    return { error: "Choose what you're looking for." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ relationship_intention })
    .eq("user_id", user.id);

  if (error) return { error: "Couldn't save that — try again." };
  redirect(nextStepPath("goals"));
}

// ---------------------------------------------------------------------
// Step: preferences
// ---------------------------------------------------------------------
export async function savePreferences(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const age_min = Number(formData.get("age_min"));
  const age_max = Number(formData.get("age_max"));
  const preferred_genders = formData.getAll("preferred_genders").map(String);
  const preferred_locations = String(formData.get("preferred_locations") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!age_min || !age_max || age_min > age_max) {
    return { error: "Enter a valid age range." };
  }
  if (preferred_genders.length === 0) {
    return { error: "Select who you'd like to meet." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Finish basic info first." };

  const { error } = await supabase.from("preferences").upsert(
    {
      profile_id: profile.id,
      age_min,
      age_max,
      preferred_genders,
      preferred_locations,
    },
    { onConflict: "profile_id" }
  );

  if (error) return { error: "Couldn't save that — try again." };
  redirect(nextStepPath("preferences"));
}

// ---------------------------------------------------------------------
// Step: compatibility-preferences
// ---------------------------------------------------------------------
export async function saveCompatibilityPreferences(_prev: unknown, formData: FormData) {
  const { supabase, user } = await requireUser();
  const languageNames = formData.getAll("preferred_languages").map(String);
  const education_pref = String(formData.get("education_pref") ?? "").trim();
  const lifestyle_pref = {
    smoking: String(formData.get("smoking") ?? "no_preference"),
    wants_children: String(formData.get("wants_children") ?? "no_preference"),
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!profile) return { error: "Finish basic info first." };

  const { data: languageRows } = await supabase
    .from("languages")
    .select("id, name")
    .in("name", languageNames);

  const { error } = await supabase.from("preferences").upsert(
    {
      profile_id: profile.id,
      preferred_languages: languageRows?.map((l) => l.id) ?? [],
      education_pref: education_pref || null,
      lifestyle_pref,
    },
    { onConflict: "profile_id" }
  );

  if (error) return { error: "Couldn't save that — try again." };
  redirect(nextStepPath("compatibility-preferences"));
}

// ---------------------------------------------------------------------
// Step: preview → finish
// ---------------------------------------------------------------------
export async function finishOnboarding() {
  redirect("/discover");
}
