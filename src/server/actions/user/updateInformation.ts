"use server";

import supabase from "@/server/supabase";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function updateUserField(prevState: unknown, formData: FormData) {
  const field = formData.get("field") as string;
  const value = formData.get("value") as string;
  const user = await withAuth({ ensureSignedIn: true });

  const { data, error } = await supabase
    .from("users")
    .update({ [field]: value, updatedAt: new Date() })
    .eq("workOSId", user.user?.id);

  if (error) {
    throw new Error(error.message);
  }

  return { success: true, data };
}
