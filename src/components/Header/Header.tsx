import {
  Burger,
  Group,
  Anchor,
  Menu,
  Indicator,
  Image,
  Button,
  Text,
  Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { IconLogout, IconUser, IconChevronDown } from "@tabler/icons-react";

import { signout } from "@/actions/auth";

import logo from "@/assets/logo.svg";

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <Group className="h-full px-2">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group className="flex-1 justify-between">
        <Group className="items-center justify-center">
          <Image
            priority
            component={NextImage}
            src={logo}
            alt="Taoshi"
            w={40}
            h={40}
          />
          <Anchor
            className="mr-1 font-adlam-display font-bold text-black"
            component={Link}
            href="/dashboard"
          >
            taoshi
          </Anchor>
          <Anchor
            className="text-xs text-black"
            component={Link}
            href="/dashboard"
          >
            Dashboard
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
            href="https://github.com/taoshidev/request-network/blob/main/VALIDATOR_INSTRUCTIONS.md"
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
            href="mailto: lphan@taoshi.io"
            target="_blank"
          >
            Support
          </Anchor>

          <>
            <Divider color="black" variant="dashed" orientation="vertical" />
            <Menu position="bottom-end" offset={5} width={200}>
              <Menu.Target>
                <Button
                  variant="transparent"
                  rightSection={<IconChevronDown size={16} stroke={1} />}
                >
                  <Text className="text-sm">Settings</Text>
                </Button>
              </Menu.Target>
              <Menu.Dropdown className="border border-dashed border-black">
                <Menu.Item
                  component={Link}
                  href="/profile"
                  leftSection={<IconUser size={16} stroke={1} />}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider className="border-dashed bg-black" />
                <Menu.Item
                  onClick={handleSignOut}
                  leftSection={<IconLogout size={16} stroke={1} />}
                >
                  Log Out
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </>
        </Group>
      </Group>
    </Group>
  );
}
