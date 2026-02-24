import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="p-6">
            <h1>Dashboard</h1>
            <p>Welcome {user.email}</p>
        </div>
    )
}