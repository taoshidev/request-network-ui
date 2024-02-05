"use client";

import { AppShell } from "@mantine/core";

import { Header } from "@/components/Header";
import { Dashboard } from "@/components/Dashboard";

export default function Layout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Dashboard />
      </AppShell.Main>
    </AppShell>
  );
}
