"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

interface FormData {
  email: string;
  password: string;
}

export async function getUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  return { data, error };
}

export async function updateUser(formData: any) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.updateUser(formData);

  return { data, error };
}

export async function login(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword(formData);

  if (error) {
    return redirect(`/auth/login?message=${error.message}`);
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.email as string,
    password: formData.password as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect(`/auth/signup?message=${error.message}`);
  }

  revalidatePath("/", "layout");
}

export async function signout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/");
}

export async function forgotPassword(email: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    return redirect(`/auth/forgot?message=${error.message}`);
  }

  revalidatePath("/", "layout");
}
