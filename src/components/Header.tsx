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
import {
  IconLogout,
  IconUser,
  IconChevronDown,
  IconBell,
} from "@tabler/icons-react";
import useSWR from "swr";
import { signout } from "@/actions/auth";
import { getUserNotifications } from "@/actions/notifications";
import { UserNotificationType } from "@/db/types/user-notifications";
import { isArray as _isArray } from "lodash";
import Notifications from "./Notifications";

export function Header() {
  let { data: userNotifications, isLoading: notificationIsLoading } = useSWR(
    "/api/user-notifications",
    async () => await getUserNotifications(),
    { refreshInterval: 5000 }
  );
  if (!_isArray(userNotifications)) userNotifications = [];

  const [opened, { toggle }] = useDisclosure();
  const [notificationsOpened, { toggle: toggleNotifications }] =
    useDisclosure();

  const handleSignOut = async () => {
    await signout();
  };

  return (
    <>
      <Button
        variant={
          userNotifications?.length &&
          userNotifications.some((un: UserNotificationType) => !un.viewed)
            ? "filled"
            : "outline"
        }
        className={
          "float-end rounded-full px-2 top-6 right-5 notify-bell" +
          (userNotifications?.length &&
          userNotifications.some((un: UserNotificationType) => !un.viewed)
            ? " active"
            : "")
        }
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
              <Divider color="black" orientation="vertical" />
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

      <Notifications
        opened={notificationsOpened}
        toggle={toggleNotifications}
        isLoading={notificationIsLoading}
        userNotifications={userNotifications}
      />
    </>
  );
}
