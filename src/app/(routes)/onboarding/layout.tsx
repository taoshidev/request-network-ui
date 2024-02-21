"use client";

import { Center, Container } from "@mantine/core";

export default function Layout({ children }: any) {
  return (
    <Container h="100%">
      <Center h="100%">{children}</Center>
    </Container>
  );
}
