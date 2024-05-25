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
  Loader,
  Box,
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
import { deleteUserNotification, getUserNotifications } from "@/actions/notifications";
import {
  NOTIFICATION_COLOR,
  NOTIFICATION_ICON,
  NotificationTypes,
} from "@/hooks/use-notification";
import { UserNotificationType } from "@/db/types/user-notifications";
import { isArray as _isArray } from "lodash";

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

  async function deleteNotification(id: string) {
    await deleteUserNotification(id);
    console.log(id);
  }

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

      <Drawer
        position="right"
        className="app-notifications"
        opened={notificationsOpened}
        onClose={toggleNotifications}
        title="Notifications"
      >
        <br />
        {notificationIsLoading ? (
          <Box className="text-center">
            <Loader size="xl" />
          </Box>
        ) : (
          (userNotifications || []).map((userNotification) => (
            <Notification
              onClose={deleteNotification.bind(null, userNotification.id)}
              key={userNotification.id}
              className="shadow-md border-gray-200 mb-3"
              icon={
                NOTIFICATION_ICON[
                  NotificationTypes[userNotification.notification.type]
                ]
              }
              color={
                NOTIFICATION_COLOR[
                  NotificationTypes[userNotification.notification.type]
                ]
              }
              title={userNotification.notification.subject}
            >
              {userNotification.notification.content}
            </Notification>
          ))
        )}
      </Drawer>
    </>
  );
}
