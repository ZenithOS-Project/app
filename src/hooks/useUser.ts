import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

export const useUser = () => {
  return useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await fetch(`/api/user/me`);
      return res.json();
    },
  });
};
