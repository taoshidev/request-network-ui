"use client";

import { useState, useEffect, useCallback } from "react";
import { Group, Anchor, Button, Burger, Box, Drawer } from "@mantine/core";
import Link from "next/link";
import {
  IconHelpSquare,
  IconChartBar,
  IconFileStack,
  IconCode,
  IconDashboard,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import ClientRedirect from "@components/ClientRedirect";
import Loading from "@/app/(auth)/loading";

export function HeaderHome({
  startLink = "/dashboard",
}: {
  startLink?: string;
}) {
  const [loading, setLoading] = useState(false);
  const iconSizeLg = 20;
  const iconSizeSm = 14;

  const navLinks = useCallback(
    (iconSize: number) => {
      return [
        {
          href: "https://ipfs.filebase.io/ipfs/QmWuD5B77xBf6TE3mMUdAMaXeqVf6JkUYzhpW85W8jiAZY",
          name: "Whitepaper",
          target: "_blank",
          indicator: true,
          icon: <IconChartBar size={iconSize} />,
          dataCy: "btn-header-whitepaper",
        },
        {
          href: "/documentation",
          name: "Validator Docs",
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
          href: "mailto: support-request@taoshi.io",
          name: "Support",
          icon: <IconHelpSquare size={iconSize} />,
          dataCy: "btn-header-support",
        },
        {
          href: startLink,
          name: "Dashboard",
          icon: <IconDashboard size={iconSize} />,
          iconOnlyMobile: true,
          variant: "white",
          dataCy: "btn-header-dashboard",
        },
      ];
    },
    [startLink]
  );

  const [opened, { toggle, close }] = useDisclosure();

  useEffect(() => {
    return () => setLoading(false);
  }, []);

  return (
    <>
      {loading && <ClientRedirect />}
      <div className="h-full p-4">
        <div className="flex-1 flex md:justify-between justify-center">
          <Burger
            opened={opened}
            onClick={toggle}
            className="absolute left-5 top-5"
            hiddenFrom="sm"
            size="sm"
            color="white"
          />
          <Anchor
            className="mr-1 font-adlam-display font-bold text-2xl text-white"
            component={Link}
            href="/"
          >
            taoshi
          </Anchor>
          <Group className="ml-1" visibleFrom="sm" gap="xs">
            {navLinks(iconSizeSm).map((navLink) => (
              <Button
                key={navLink.href}
                className="text-sm font-normal px-2"
                component={Link}
                leftSection={navLink.iconOnlyMobile ? undefined : navLink.icon}
                href={navLink.href}
                target={navLink.target}
                variant={navLink.variant}
                data-cy={navLink.dataCy}
                onClick={() => {
                  if(navLink.name === "Dashboard") setLoading(true)
                }}
              >
                {navLink.name}
              </Button>
            ))}
          </Group>
        </div>
      </div>

      <Drawer
        title={
          <Box className="items-center justify-center">
            <Anchor
              className="mr-1 font-adlam-display text-zinc-800 text-3xl font-bold no-underline"
              component={Link}
              href="/"
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
          {navLinks(iconSizeLg).map((navLink) => (
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
                <Box className=" p-3 grow">{navLink.name}</Box>
              </Anchor>
            </Box>
          ))}
        </Box>
      </Drawer>
    </>
  );
}
