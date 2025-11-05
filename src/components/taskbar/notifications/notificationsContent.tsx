"use client";
import EmptyNotifications from "./empty";
import { ScrollArea } from "@/shadcn/scroll-area";
import {
  BookOpenCheck,
  Info,
  MailCheck,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
} from "lucide-react";
import { Button } from "@/shadcn/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/tooltip";
import { markNotificationAsRead } from "@/actions/notifications/markAsRead";
import { useActionState, useEffect, useTransition } from "react";
import { Spinner } from "@/shadcn/spinner";
import { toast } from "sonner";
import { getAllNotifications } from "@/fetchers/notifications/getAllNotifications";
import { markAllNotificationsAsRead } from "@/actions/notifications/markAllAsRead";
import { Kbd, KbdGroup } from "@/shadcn/kbd";
import type { Notification } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function NotificationsContent({
  isOpen,
  userId,
}: {
  notifications?: Notification[];
  isOpen?: boolean;
  userId: string;
}) {
  const queryClient = useQueryClient();
  const [refreshPending, startTransition] = useTransition();

  const [readState, readAction, readIsPending] = useActionState(
    markNotificationAsRead,
    null,
  );
  const [markAllState, markAllAction, markAllIsPending] = useActionState(
    markAllNotificationsAsRead,
    null,
  );

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notifications", userId],
    queryFn: () => getAllNotifications(userId),
  });

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return a.isRead ? 1 : -1;
  });

  useEffect(() => {
    if (isOpen) {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
    }
  }, [isOpen, queryClient, userId]);

  useEffect(() => {
    if (readState?.success || markAllState?.success) {
      queryClient.invalidateQueries({
        queryKey: ["notifications", userId],
      });
    }

    if (markAllState?.success) {
      toast.success("All notifications marked as read");
    }

    if (readState?.success) {
      toast.success("Notification marked as read");
    }
  }, [readState, markAllState, queryClient, userId]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey && e.key.toLowerCase() === "r") {
      e.preventDefault();
      startTransition(() => {
        queryClient.invalidateQueries({
          queryKey: ["notifications", userId],
        });
        toast.success("Notifications refreshed");
      });
    } else if (e.shiftKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      startTransition(() => {
        const form = new FormData();
        form.append("userId", userId);
        markAllAction(form);
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [userId]);

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="flex items-center justify-between text-lg font-semibold">
        Notifications ({notifications.length})
        <div className="flex flex-row">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                disabled={refreshPending}
                onClick={() => {
                  startTransition(() => {
                    queryClient.invalidateQueries({
                      queryKey: ["notifications", userId],
                    });
                    toast.success("Notifications refreshed");
                  });
                }}
              >
                {refreshPending || isLoading ? <Spinner /> : <RotateCcw />}
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex gap-2">
              Refresh Notifications
              <KbdGroup>
                <Kbd>Shift</Kbd> + <Kbd>R</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={markAllIsPending}
                onClick={() => {
                  startTransition(() => {
                    const form = new FormData();
                    form.append("userId", userId);
                    markAllAction(form);
                  });
                }}
              >
                <MailCheck />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="flex gap-2">
              Mark All As Read
              <KbdGroup>
                <Kbd>Shift</Kbd> + <Kbd>A</Kbd>
              </KbdGroup>
            </TooltipContent>
          </Tooltip>
        </div>
      </h2>
      {notifications.length > 0 ? (
        <ScrollArea className="h-80 w-80">
          <div className="flex flex-col gap-3">
            {sortedNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex flex-row items-center gap-3 rounded-md border p-3 shadow-sm transition-colors ${
                  notification.isRead
                    ? "bg-muted/30 border-border/50"
                    : "bg-primary/10 border-primary/30"
                }`}
              >
                {notification.type === "info" && (
                  <Info className="text-primary" />
                )}
                {notification.type === "warning" && (
                  <ShieldAlert className="text-warning" />
                )}
                {notification.type === "success" && (
                  <ShieldCheck className="text-success" />
                )}
                {notification.type === "error" && (
                  <ShieldX className="text-error" />
                )}
                <div>
                  <div className="text-sm">{notification.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {notification.message}
                  </div>
                </div>
                {!notification.isRead && (
                  <form className="ml-auto" action={readAction}>
                    <input
                      type="hidden"
                      name="notificationId"
                      value={notification.id}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" disabled={readIsPending}>
                          {readIsPending ? <Spinner /> : <BookOpenCheck />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Mark As Read</p>
                      </TooltipContent>
                    </Tooltip>
                  </form>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <EmptyNotifications />
      )}
    </div>
  );
}
