import {
  Burger,
  Group,
  Anchor,
  Menu,
  Indicator,
  Button,
  Text,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconLogout, IconUser, IconChevronDown } from "@tabler/icons-react";

import { signout } from "@/actions/auth";

export function HeaderHome() {
  const [opened, { toggle }] = useDisclosure();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <Group className="h-full p-4">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group className="flex-1 justify-between">
        <Group className="items-center justify-center">
          <Anchor
            className="mr-1 font-adlam-display font-bold text-2xl text-primary-700"
            component={Link}
            href="/dashboard"
          >
            taoshi
          </Anchor>
        </Group>
        <Group gap="xl" className="ml-1" visibleFrom="sm">
          <Anchor
            className="text-sm text-primary-800"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            <Indicator position="top-start" size={6}>
              Status
            </Indicator>
          </Anchor>
          <Anchor
            className="text-sm text-primary-800"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Docs
          </Anchor>
          <Anchor
            className="text-sm text-primary-800"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Help
          </Anchor>
          <Anchor
            className="text-sm text-primary-800"
            component={Link}
            href="docs.taoshi.io"
            target="_blank"
          >
            Support
          </Anchor>
        </Group>
      </Group>
    </Group>
  );
}
