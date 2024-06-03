"use client";

import { AppShell, Container } from "@mantine/core";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
export default function Layout({ children }: any) {
  return (
    <AppShell className="flex flex-col min-h-screen">
      <AppShell.Header className="sticky h-[90px] flex-none">
        <Header />
      </AppShell.Header>
      <AppShell.Main className="flex-grow bg-stone-100 overflow-auto">
        <Container className="py-16 max-w-6xl scrollbar-hide">
          {children}
        </Container>
      </AppShell.Main>
      <AppShell.Footer className="relative h-[185px] flex-none">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}
