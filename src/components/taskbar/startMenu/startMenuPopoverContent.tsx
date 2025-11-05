"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/avatar";
import { useAuth } from "@workos-inc/authkit-nextjs/components";
import { Popover, PopoverContent, PopoverTrigger } from "@/shadcn/popover";
import { Button } from "@/shadcn/button";
import { logout } from "@/actions/logout/logout";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shadcn/tooltip";
import { Settings, Power } from "lucide-react";
import { Separator } from "@/shadcn/separator";
import {
  AlertDialog,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogCancel,
} from "@/shadcn/alert-dialog";
import { openApp } from "@/lib/openApp";
import type { User } from "@/types/user";

export default function StartMenuPopoverContent({ user }: { user: User }) {
  return (
    <div className="flex flex-row">
      <div className="flex h-80 flex-col items-center justify-end gap-2 p-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Power />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </span>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to sign out?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost">Cancel</Button>
              </AlertDialogCancel>
              <form action={logout}>
                <Button type="submit" variant="outline">
                  Yes, Sign out
                </Button>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="p-0"
              onClick={() => {
                openApp("settings");
              }}
            >
              <Settings />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Settings</TooltipContent>
        </Tooltip>
        <Avatar className="w-full">
          <AvatarImage src={user ? user.avatar : ""} />
          <AvatarFallback>
            {user ? user.username?.charAt(0) : ""}
          </AvatarFallback>
        </Avatar>
      </div>
      <Separator orientation="vertical" className="min-h-80" />
      {/* <div>test</div> */}
    </div>
  );
}
