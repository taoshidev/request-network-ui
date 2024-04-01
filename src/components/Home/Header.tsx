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

import logo from "@/assets/logo.svg";

export function Header() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <Group className="h-full" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group className="flex-1 justify-between">
        <Group>
          <Image
            component={NextImage}
            src={logo}
            alt="Taoshi"
            w={40}
            height={40}
          />
          <Anchor
            className="font-adlam-display font-bold text-black"
            component={Link}
            href="/"
          >
            taoshi
          </Anchor>
        </Group>
        <Group ml="xl" visibleFrom="sm">
          <Anchor
            className="text-black"
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
            className="text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            Docs
          </Anchor>
          <Anchor
            className="text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
            size="sm"
          >
            Help
          </Anchor>
          <Anchor
            className="text-black"
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
