"use client";

import { Toaster } from "@/shadcn/sonner";
import { ThemeProvider } from "next-themes";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 1000 * 60 * 5,
    },
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthKitProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthKitProvider>
  );
}
