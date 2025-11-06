"use server";
import { getUser } from "@/fetchers/user/getUser";
import supabase from "@/server/supabase";
import { logout } from "@/actions/logout/logout";

export async function deleteAccount() {
  const user = await getUser();

  if (!user) {
    throw new Error("User not found");
  }

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("workOSId", user.workOSId);

  if (error) {
    throw new Error("Failed to delete user");
  }

  await logout();

  return data;
}
