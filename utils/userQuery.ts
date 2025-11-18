import { createClient } from "@/lib/supabase/server";

export const getUser = async (userID: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("first_name, last_name, role, created_at")
    .eq("id", userID)
    .single();

  if (error) {
    console.error("Error fethcing user", error);
    return null;
  }

  return data;
};

export const getClaims = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error) {
    console.error("Error fetching claims", error);
    return null;
  }

  return data?.claims ? data.claims : null;
};
