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
import { IconLogout, IconUser, IconArrowDown } from "@tabler/icons-react";

import { signout } from "@/actions/auth";

import styles from "./header.module.css";

import logo from "@/assets/logo.svg";

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Group align="center" justify="center">
          <Image
            component={NextImage}
            src={logo}
            alt="Taoshi"
            width={40}
            height={40}
          />
          <Anchor
            mr="lg"
            className={styles.logo}
            component={Link}
            href="/dashboard"
          >
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

          <>
            <Divider color="black" variant="dashed" orientation="vertical" />
            <Menu position="bottom-end" offset={5} width={200}>
              <Menu.Target>
                <Button
                  variant="transparent"
                  rightSection={<IconArrowDown size={16} stroke={1} />}
                >
                  <Text size="sm">Settings</Text>
                </Button>
              </Menu.Target>
              <Menu.Dropdown className={styles.menu}>
                <Menu.Item
                  component={Link}
                  href="/profile"
                  leftSection={<IconUser size={16} stroke={1} />}
                >
                  Profile
                </Menu.Item>
                <Menu.Divider className={styles.divider} />
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
