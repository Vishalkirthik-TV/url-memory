"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
    const supabase = await createClient();
    const title = formData.get("title") as string;
    const url = formData.get("url") as string;

    if (!title || !url) {
        return { error: "Title and URL are required" };
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Must be logged in" };
    }

    const { data: insertedData, error } = await supabase
        .from("bookmarks")
        .insert({
            title,
            url,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true, data: insertedData };
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;

    const { error } = await supabase.auth.updateUser({
        data: {
            full_name: fullName,
            username: username,
            bio: bio
        }
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("bookmarks")
        .update({ is_favorite: isFavorite })
        .eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    return { success: true };
}
