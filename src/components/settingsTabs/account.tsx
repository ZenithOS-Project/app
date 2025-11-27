"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/avatar";
import { Skeleton } from "@/shadcn/skeleton";
import type { User } from "@/types";
import { Separator } from "@/shadcn/separator";
import { Input } from "@/shadcn/input";
import { Label } from "@/shadcn/label";
import { UploadButton } from "@/utils/uploadthing";
import { PenLine, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/shadcn/button";
import { useActionState, useEffect, useState } from "react";
import { updateUserField } from "@/actions/user/updateInformation";
import { deleteAccount } from "@/actions/user/deleteAccount";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";

export default function AccountSettings() {
  const queryClient = useQueryClient();
  const { data: user, isError, isLoading } = useUser();

  const [isUploading, setIsUploading] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [state, formAction, isPending] = useActionState(updateUserField, null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Information updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    }
  }, [state]);

  const [deleteState, deleteAction, isDeleting] = useActionState(
    deleteAccount,
    null,
  );

  if (isLoading) {
    return (
      <div>
        <div className="mb-4 flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    );
  }

  if (isError || !user) {
    return <div>Error loading user data.</div>;
  }

  const EditableField = ({
    label,
    fieldName,
    value,
  }: {
    label: string;
    fieldName: string;
    value: string;
  }) => {
    const [inputValue, setInputValue] = useState(value);
    const isEditing = editingField === fieldName;
    const hasChanged = inputValue !== value;

    const handleSave = (formData: FormData) => {
      formAction(formData);
      setEditingField(null);
    };

    const handleCancel = () => {
      setInputValue(value);
      setEditingField(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && hasChanged) {
        const formData = new FormData();
        formData.append("field", fieldName);
        formData.append("value", inputValue);
        handleSave(formData);
      }
      if (e.key === "Escape") handleCancel();
    };

    return (
      <div className="w-full max-w-[358px]">
        <div className="flex flex-row justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <button
            onClick={() => setEditingField(fieldName)}
            className="hover:bg-muted rounded-lg p-2 transition-all"
          >
            <PenLine size={16} className="text-muted-foreground" />
          </button>
        </div>
        {isEditing ? (
          <form action={handleSave} className="flex items-center gap-2">
            <input type="hidden" name="field" value={fieldName} />
            <Input
              name="value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              type={fieldName === "email" ? "email" : "text"}
              className="w-72"
              autoFocus
            />
            <button
              type="submit"
              disabled={!hasChanged || isPending}
              className="hover:bg-primary/10 text-primary rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="hover:bg-destructive/10 text-muted-foreground rounded-lg p-2 transition-colors"
            >
              <X size={18} />
            </button>
          </form>
        ) : (
          <div className="group flex items-center gap-2">
            <Input value={value} className="w-full" disabled />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="relative w-fit">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.username[0]}</AvatarFallback>
          </Avatar>
          <div className="upload-button-wrapper absolute right-0 bottom-0">
            <UploadButton
              endpoint="avatarUploader"
              onUploadBegin={() => {
                setIsUploading(true);
              }}
              onClientUploadComplete={async () => {
                setIsUploading(false);
                toast.success("Upload complete");
                await queryClient.invalidateQueries({
                  queryKey: ["user"],
                });
              }}
              onUploadError={() => {
                toast.error("Upload failed");
                setIsUploading(false);
              }}
              appearance={{
                button: {
                  padding: "0",
                  margin: "0",
                  background: "var(--color-secondary)",
                  borderRadius: "9999px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                  minHeight: "28px",
                  minWidth: "28px",
                  height: "28px",
                  width: "28px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  cursor: "pointer",
                },
                allowedContent: {
                  display: "none",
                },
              }}
              content={{
                button() {
                  return (
                    <div className="flex items-center justify-center">
                      {isUploading ? (
                        <Loader2
                          size={14}
                          className="text-secondary-foreground animate-spin"
                        />
                      ) : (
                        <PenLine
                          size={14}
                          className="text-secondary-foreground"
                        />
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">{user?.username}</h2>
        </div>
      </div>

      <Separator />

      <div className="flex flex-row justify-between gap-10">
        <div className="">
          <h3 className="mb-1 text-base font-semibold">Public information</h3>
          <p className="text-muted-foreground text-sm">
            This information is visible to everyone.
          </p>
        </div>
        <EditableField
          label="Username"
          fieldName="username"
          value={user?.username || ""}
        />
      </div>

      <Separator />

      <div className="flex flex-row justify-between gap-10">
        <div className="">
          <h3 className="mb-1 text-base font-semibold">Private information</h3>
          <p className="text-muted-foreground text-sm">
            This information is only visible to you.
          </p>
        </div>
        <EditableField
          label="Email Address"
          fieldName="email"
          value={user?.email || ""}
        />
      </div>

      <Separator />

      <div className="flex flex-row justify-between">
        <div>
          <h3 className="text-destructive mb-1 text-base font-semibold">
            Danger zone
          </h3>
          <p className="text-muted-foreground text-sm">
            These actions cannot be undone.
          </p>
        </div>
        <form action={deleteAction}>
          <Button variant="destructive" disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
