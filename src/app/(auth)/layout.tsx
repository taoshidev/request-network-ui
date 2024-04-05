"use client";

import { AppShell } from "@mantine/core";

import { Header } from "@/components/Header";

export default function Layout({ children }: any) {
  return (
    <AppShell>
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
