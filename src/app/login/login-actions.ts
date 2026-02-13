"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login() {
    const supabase = await createClient();
    const headerList = await headers();
    const host = headerList.get("host");
    const protocol = headerList.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${origin}/auth/callback?next=/dashboard`,
        },
    });

    if (data.url) {
        redirect(data.url);
    }

    if (error) {
        redirect("/error");
    }
}
