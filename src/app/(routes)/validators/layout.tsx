"use client";

import { AppShell } from "@mantine/core";

import { Header } from "@/components/Header";

export default function Layout({ children }: any) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header style={{ borderBottom: "1px dashed black" }}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
