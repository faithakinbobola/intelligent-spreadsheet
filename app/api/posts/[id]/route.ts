import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const supabase = await createClient();
    const user = await getUserWithRole();

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
        .from("post_actions")
        .select(
            `
            delivery_note,
            created_at,
            updated_at
            profiles(name),
            `
        )
        .eq("post_id", params.id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data);
}