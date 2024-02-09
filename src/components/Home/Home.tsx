"use client";

import Link from "next/link";
import NextImage from "next/image";
import {
  Image,
  AppShell,
  Box,
  Text,
  Container,
  Title,
  Group,
  Center,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { Header } from "./Header";

import styles from "./home.module.css";

import logo from "@/assets/intraday.svg";

export function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header style={{ borderBottom: "1px dashed black" }}>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Container my="xl">
          <Center h={400}>
            <Group>
              <Box flex="1">
                <Title mb="sm" order={1}>
                  Request. Bittensor.
                </Title>
                <Text mb="lg">
                  Pariatur ad excepteur veniam et dolore elit quis nostrud
                  commodo nostrud minim ipsum magna non. Dolore est est sunt
                  irure Lorem duis.
                </Text>
                <Button>Dashboard</Button>
              </Box>
              <Box flex="1">
                <Image
                  fit="contain"
                  h={200}
                  alt="Taoshi"
                  component={NextImage}
                  src={logo}
                />
              </Box>
            </Group>
          </Center>
        </Container>
      </AppShell.Main>
      <AppShell.Footer>footer</AppShell.Footer>
    </AppShell>
  );
}
