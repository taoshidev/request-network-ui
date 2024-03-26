"use client";

import { AppShell } from "@mantine/core";
import { Header } from "@/components/Header";
import { RegistrationProvider } from "@/providers/registration-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RegistrationProvider>
      <AppShell header={{ height: 60 }} padding="md">
        <AppShell.Header style={{ borderBottom: "1px dashed black" }}>
          <Header />
        </AppShell.Header>
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </RegistrationProvider>
  );
}
