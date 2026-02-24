import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserWithRole } from "@/lib/auth";

export async function POST(req: Request) {
    const supabase = await createClient();
    const user = await getUserWithRole();

    if (!user || user.role !== "ASSOCIATE") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { postId, deliveryNote } = await req.json();

    if (!deliveryNote) {
        return NextResponse.json({ error: "Delivery Note not delivered" }, { status: 400 });
    }

    const { error } = await supabase.from("post_actions").upsert({
        post_id: postId,
        user_id: user.id,
        delivery_note: deliveryNote,
        liked: true,
    },
        { onConflict: "post_id,user_id" }
    );

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
}

