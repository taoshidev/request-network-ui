"use server";

import { createClient } from "@/lib/supabase/server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getSupabaseSession() {
  const supabase = createClient();
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getAuthUser() {
  const supabase = createClient();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function getUser() {
  const supabase = createClient();
  try {
    const { data, error } = await supabase.from("users").select("*").single();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function updateUser(formData: any) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.updateUser(formData);

  return { data, error };
}

export async function updateUserById(formData: any) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.admin.updateUserById(
    formData.id,
    formData
  );
  return { data, error };
}

export async function signout() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}