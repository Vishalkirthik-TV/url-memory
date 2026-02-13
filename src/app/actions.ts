"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

async function fetchMetadata(url: string) {
    try {
        const response = await fetch(url, {
            next: { revalidate: 3600 },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });
        const html = await response.text();

        // Basic meta description extraction
        const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i) ||
            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);

        return descMatch ? descMatch[1] : null;
    } catch (error) {
        console.error("Metadata fetch error:", error);
        return null;
    }
}

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

    const description = await fetchMetadata(url);

    const { data: insertedData, error } = await supabase
        .from("bookmarks")
        .insert({
            title,
            url,
            description,
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/organize");
    return { success: true, data: insertedData };
}

export async function createCategory(name: string, icon?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Must be logged in" };

    const { data, error } = await supabase
        .from("categories")
        .insert({
            name,
            icon,
            user_id: user.id
        })
        .select()
        .single();

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/organize");
    return { data };
}

export async function deleteCategory(id: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/organize");
    return { success: true };
}

export async function updateBookmarkCategory(bookmarkId: string, categoryId: string | null) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("bookmarks")
        .update({ category_id: categoryId })
        .eq("id", bookmarkId);

    if (error) return { error: error.message };

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/organize");
    return { success: true };
}

export async function deleteBookmark(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("bookmarks").delete().eq("id", id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/organize");
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
    revalidatePath("/dashboard/organize");
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
    revalidatePath("/dashboard/organize");
    return { success: true };
}
