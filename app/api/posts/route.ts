import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/auth";

export async function GET() {
    const supabase = await createClient();
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
    const supabase = await createClient();
    const user = await getUserWithRole();

    if (!user || user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { title, content, dueDate, assignmentScope, assignedUserIds } = await req.json();

    const { data: post, error } = await supabase
        .from("posts")
        .insert({
            title,
            content,
            due_date: dueDate,
            assignment_scope: assignmentScope,
            created_by: user.id,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (assignmentScope === "SPECIFIC" && assignedUserIds?.length) {
        const assignments = assignedUserIds.map((id: string) => ({
            post_id: post.id,
            user_id: id,
        }))

        await supabase.from("post_assigments").insert(assignments);
    }

    return NextResponse.json(post);
}