import {
  Burger,
  Group,
  Anchor,
  Menu,
  Indicator,
  Button,
  Text,
  Divider,
  Drawer,
  Notification,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconLogout,
  IconUser,
  IconChevronDown,
  IconBell,
} from "@tabler/icons-react";

import { signout } from "@/actions/auth";

enum NOTIFICATION_TYPE {
  SUCCESS = "green",
  WARNING = "yellow",
  DANGER = "red",
  INFO = "blue",
  BUG = "black",
}

export function Header() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();
  const [notificationsOpened, { toggle: toggleNotifications }] =
    useDisclosure();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <>
      <Button
        variant={true ? "filled" : "outline"}
        className={'float-end rounded-full px-2 top-6 right-5 notify-bell' + (true ? ' active' : '')}
        onClick={toggleNotifications}
      >
        <IconBell />
      </Button>
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

      <Drawer
        position="right"
        className="app-notifications"
        opened={notificationsOpened}
        onClose={toggleNotifications}
        title="Notifications"
      >
        <Notification color={NOTIFICATION_TYPE.SUCCESS}>Test</Notification>
        <br />
        <Notification color={NOTIFICATION_TYPE.SUCCESS}>Test</Notification>
        <br />
        <Notification color={NOTIFICATION_TYPE.SUCCESS}>Test</Notification>
        <br />
        <Notification color={NOTIFICATION_TYPE.SUCCESS}>Test</Notification>
        <br />
        <Notification color={NOTIFICATION_TYPE.SUCCESS}>Test</Notification>
        <br />
      </Drawer>
    </>
  );
}
