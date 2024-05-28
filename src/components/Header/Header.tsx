import {
  Burger,
  Group,
  Anchor,
  Menu,
  Indicator,
  Button,
  Text,
  Divider,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLogout, IconUser, IconChevronDown } from "@tabler/icons-react";

import { signout } from "@/actions/auth";

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-black absolute px-5 font-bold w-full top-0 opacity-40">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      <Group className="h-full px-2 py-5 max-w-6xl m-auto">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group className="flex-1 justify-between h-12">
          <Group className="items-center justify-center">
            <Anchor
              className="mr-1 font-adlam-display text-zinc-800 text-3xl font-bold no-underline"
              component={Link}
              href="/dashboard"
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
              href="/documentation"
            >
              Docs
            </Anchor>
            <Anchor
              className="text-sm text-black"
              component={Link}
              href="/contributing"
            >
              Contribute
            </Anchor>
            <Anchor className="text-sm text-black" component={Link} href="/faq">
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
            <Anchor
              className="text-sm text-black"
              component={Link}
              href="/dashboard"
            >
              Dashboard
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
                <Menu.Dropdown>
                  <Menu.Item
                    component={Link}
                    href="/profile"
                    leftSection={<IconUser size={16} stroke={1} />}
                  >
                    Profile
                  </Menu.Item>
                  <Menu.Divider />
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
    </>
  );
}
