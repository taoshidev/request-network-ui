"use client";

import { AppShell, Container } from "@mantine/core";

import { Header } from "@/components/Header";

export default function Layout({ children }: any) {
  return (
    <AppShell className="flex flex-col h-screen">
      <AppShell.Header className="flex-none">
        <Header />
      </AppShell.Header>
      <AppShell.Main className="flex-grow overflow-auto">
        <Container className="mt-[60px] p-12 h-[calc(100vh-60px)] overflow-auto mx-auto max-w-7xl scrollbar-hide">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
