// client-layout.tsx
"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/common/providers/theme-provider";
import { ApolloProvider } from "@/common/providers/apollo-provider";
import AuthProvider from "@/common/providers/auth-provider";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ApolloProvider>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
