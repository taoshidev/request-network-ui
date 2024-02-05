"use client";

import { AppShell } from "@mantine/core";

import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";

export default function Layout({ children }) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
