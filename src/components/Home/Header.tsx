"use client";

import Link from "next/link";
import NextImage from "next/image";
import {
  Image,
  Anchor,
  Group,
  Indicator,
  Burger,
  Divider,
  Button,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import styles from "./home.module.css";

import logo from "@/assets/logo.svg";

export function Header() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Group>
          <Image
            component={NextImage}
            src={logo}
            alt="Taoshi"
            width={40}
            height={40}
          />
          <Anchor className={styles.logo} component={Link} href="/">
            taoshi
          </Anchor>
        </Group>
        <Group ml="xl" visibleFrom="sm">
          <Anchor
            c="black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            <Indicator position="top-start" size={6}>
              Status
            </Indicator>
          </Anchor>
          <Anchor
            c="black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            Docs
          </Anchor>
          <Anchor
            c="black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            Help
          </Anchor>
          <Anchor
            c="black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            Support
          </Anchor>
          <Divider color="black" variant="dashed" orientation="vertical" />
          <Button component={Link} href="/dashboard">
            <Text size="sm">Dashboard</Text>
          </Button>
        </Group>
      </Group>
    </Group>
  );
}
