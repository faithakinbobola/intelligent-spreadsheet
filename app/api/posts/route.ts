import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { getUserWithRole } from "@/lib/auth";

export async function GET() {
    const supabase = await createSupabaseServerClient();
    const user = await getUserWithRole();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", {ascending: false});

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const supabase = await createSupabaseServerClient();
    const user = await getUserWithRole();

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, content, dueDate, assignmentScope, assignedUserIds } = await req.json();
}