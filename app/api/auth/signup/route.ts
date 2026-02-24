import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const { email, password, name, adminKey } = await req.json();
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!data.user) {
        return NextResponse.json({ error: "User creation failed" }, { status: 400 });
    }

    const role = adminKey === process.env.ADMIN_SECRET_KEY ? "ADMIN" : "ASSOCIATE";

    const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name,
        role,
    });

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

}