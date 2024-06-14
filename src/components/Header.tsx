"use client";

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
  Drawer,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import {
  IconLogout,
  IconUser,
  IconChevronDown,
  IconBell,
  IconChartBar,
  IconFileStack,
  IconCode,
  IconHelpSquare,
  IconDashboard,
} from "@tabler/icons-react";
import useSWR from "swr";
import { signout } from "@/actions/auth";
import { getUserNotifications } from "@/actions/notifications";
import { UserNotificationType } from "@/db/types/user-notifications";
import { isArray as _isArray } from "lodash";
import Notifications from "./Notifications";
import { useAuth } from "@/providers/auth-provider";

const iconSize = 20;
const navLinks = [
  {
    href: "https://docs.taoshi.io",
    name: "Status",
    target: "_blank",
    indicator: true,
    icon: <IconChartBar size={20} />,
    dataCy: "btn-header-status",
  },
  {
    href: "/documentation",
    name: "Docs",
    icon: <IconFileStack size={iconSize} />,
    dataCy: "btn-header-documentation",
  },
  {
    href: "/contributing",
    name: "Contribute",
    icon: <IconCode size={iconSize} />,
    dataCy: "btn-header-contribute",
  },
  {
    href: "/faq",
    name: "Help",
    icon: <IconHelpSquare size={iconSize} />,
    dataCy: "btn-header-faq",
  },
  {
    href: "/support",
    name: "Support",
    icon: <IconHelpSquare size={iconSize} />,
    dataCy: "btn-header-support",
  },
  {
    href: "/dashboard",
    name: "Dashboard",
    icon: <IconDashboard size={iconSize} />,
    dataCy: "btn-header-dashboard",
  },
];

export function Header() {
  let {
    data: userNotifications,
    isLoading: notificationIsLoading,
    mutate: refreshNotifications,
  } = useSWR(
    "/user-notifications",
    async () => {
      const notifications = await getUserNotifications();

      if (notifications) {
        return notifications;
      } else {
        return userNotifications;
      }
    },
    { refreshInterval: 5000 }
  );
  if (!_isArray(userNotifications)) userNotifications = [];

  const [opened, { toggle, close }] = useDisclosure();
  const [notificationsOpened, { toggle: toggleNotifications }] =
    useDisclosure();

  const { user, loading, logout } = useAuth();

  const handleSignOut = async () => {
    localStorage?.removeItem?.("_reg_data");
    close();
    await logout();
  };

  return (
    <>
      {process.env.NEXT_PUBLIC_ENV_NAME && (
        <Box className="z-10 pointer-events-none text-black absolute px-5 font-bold w-full top-0 opacity-40">
          {process.env.NEXT_PUBLIC_ENV_NAME}
        </Box>
      )}
      <Group component="nav" className="h-full px-4 py-5 max-w-6xl m-auto">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Group className="flex-1 justify-between h-12">
          <Box className="items-center justify-center">
            <Anchor
              className="mr-1 font-adlam-display text-zinc-800 text-3xl font-bold no-underline"
              component={Link}
              href="/dashboard"
            >
              taoshi
            </Anchor>
          </Box>
          <Group className="ml-1" visibleFrom="sm">
            {navLinks.map((navLink) => (
              <Anchor
                key={navLink.href}
                className="text-sm text-black"
                component={Link}
                href={navLink.href}
                target={navLink.target}
                data-cy={navLink.dataCy}
              >
                {navLink.indicator ? (
                  <Indicator position="top-start" size={6}>
                    {navLink.name}
                  </Indicator>
                ) : (
                  navLink.name
                )}
              </Anchor>
            ))}
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
            <Button
              variant={
                userNotifications?.length &&
                userNotifications.some((un: UserNotificationType) => !un.viewed)
                  ? "filled"
                  : "outline"
              }
              className={
                "rounded-full aspect-square px-0 notify-bell" +
                (userNotifications?.length &&
                userNotifications.some((un: UserNotificationType) => !un.viewed)
                  ? " active"
                  : "")
              }
              onClick={toggleNotifications}
            >
              <IconBell />
            </Button>
          </Group>
          <Button
            hiddenFrom="sm"
            variant={
              userNotifications?.length &&
              userNotifications.some((un: UserNotificationType) => !un.viewed)
                ? "filled"
                : "outline"
            }
            className={
              "rounded-full aspect-square px-0 notify-bell" +
              (userNotifications?.length &&
              userNotifications.some((un: UserNotificationType) => !un.viewed)
                ? " active"
                : "")
            }
            onClick={toggleNotifications}
          >
            <IconBell />
          </Button>
        </Group>
      </Group>

      <Drawer
        title={
          <Box className="items-center justify-center">
            <Anchor
              className="mr-1 font-adlam-display text-zinc-800 text-3xl font-bold no-underline"
              component={Link}
              href="/dashboard"
            >
              taoshi
            </Anchor>
          </Box>
        }
        opened={opened}
        onClose={close}
        size="xs"
      >
        <Box component="nav" className="-mx-4">
          {navLinks.map((navLink) => (
            <Box key={navLink.href}>
              <Anchor
                className="text-black flex justify-left px-1 hover:text-white hover:bg-primary-500"
                component={Link}
                href={navLink.href}
                target={navLink.target}
                onClick={close}
                data-cy={navLink.dataCy}
              >
                <Box className="p-3">{navLink.icon}</Box>
                <Box className=" p-3 grow">
                  {navLink.indicator ? (
                    <Indicator position="top-start" size={6}>
                      {navLink.name}
                    </Indicator>
                  ) : (
                    navLink.name
                  )}
                </Box>
              </Anchor>
            </Box>
          ))}
          <Divider color="#eee" orientation="horizontal" />
          <Anchor
            className="text-black flex justify-left px-1 hover:text-white hover:bg-primary-500"
            component={Link}
            href="/profile"
            onClick={close}
          >
            <Box className="p-3">
              <IconUser size={iconSize} />
            </Box>
            <Box className=" p-3 grow">Profile</Box>
          </Anchor>
          <button
            type="button"
            className="text-black w-full text-left flex justify-left px-1 hover:text-white hover:bg-primary-500"
            onClick={handleSignOut}
          >
            <Box className="p-3">
              <IconLogout size={iconSize} />
            </Box>
            <Box className="grow p-3">Log Out</Box>
          </button>
        </Box>
      </Drawer>

      <Notifications
        opened={notificationsOpened}
        toggle={toggleNotifications}
        refresh={refreshNotifications}
        isLoading={notificationIsLoading}
        userNotifications={userNotifications}
      />
    </>
  );
}
