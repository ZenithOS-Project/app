import { useQuery } from "@tanstack/react-query";
import { getAllNotifications } from "@/fetchers/notifications/getAllNotifications";

export const useNotifications = (userId: string) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getAllNotifications(userId),
  });
};
