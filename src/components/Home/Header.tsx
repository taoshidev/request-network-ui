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
    <Group className="h-full px-2">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group className="flex-1 justify-between">
        <Group>
          <Image component={NextImage} src={logo} alt="Taoshi" w={40} h={40} />
          <Anchor
            className="font-adlam-display font-bold text-black"
            component={Link}
            href="/"
          >
            taoshi
          </Anchor>
        </Group>
        <Group className="ml-1" visibleFrom="sm">
          <Anchor
            className="text-sm text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            <Indicator position="top-start" size={6}>
              Status
            </Indicator>
          </Anchor>
          <Anchor
            className="text-sm text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Docs
          </Anchor>
          <Anchor
            className="text-sm text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Help
          </Anchor>
          <Anchor
            className="text-sm text-black"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Support
          </Anchor>
          <Divider color="black" variant="dashed" orientation="vertical" />
          <Button component={Link} href="/dashboard">
            <Text className="text-sm">Dashboard</Text>
          </Button>
        </Group>
      </Group>
    </Group>
  );
}
