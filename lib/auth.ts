import { createSupabaseServerClient } from "./supabaseServer";

export async function getUserWithRole() {
    const supabase = createSupabaseServerClient();

    const {
        data: { user },
    } = (await supabase).auth.getUser();

    if (!user) return null;

    const { data: profile }  = await supabase
        .from("profiles")
        .select("id, name, role")
        .eq("id", user.id)
        .single();

        return profile;
}