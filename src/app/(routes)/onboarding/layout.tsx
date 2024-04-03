"use client";

import { Center, Container } from "@mantine/core";

export default function Layout({ children }: any) {
  return (
    <Container className="h-full">
      <Center className="h-full">{children}</Center>
    </Container>
  );
}
