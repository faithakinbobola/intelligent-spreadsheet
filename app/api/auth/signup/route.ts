import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: Request) {
    const { email, password, name, adminKey } = await req.json();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const role = adminKey === process.env.ADMIN_SECRET_KEY ? "ADMIN" : "ASSOCIATE";

    supabase.from("profiles").insert({
        id: data.user?.id,
        name,
        role,
    })
}