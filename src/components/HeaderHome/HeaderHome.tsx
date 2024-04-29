import { Burger, Group, Anchor, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { IconHelpSquare, IconScript, IconChartBar } from "@tabler/icons-react";

export function HeaderHome() {
  const [opened, { toggle }] = useDisclosure();

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
          <Button
            className="text-sm text-primary-800 font-normal"
            component={Link}
            leftSection={<IconChartBar size={14} />}
            href="docs.taoshi.io"
            target="_blank"
          >
            Status
          </Button>
          <Button
            className="text-sm text-primary-800 font-normal"
            component={Link}
            leftSection={<IconScript size={14} />}
            href="docs.taoshi.io"
            target="_blank"
          >
            Docs
          </Button>
          <Button
            className="text-sm text-primary-800 font-normal"
            component={Link}
            leftSection={<IconHelpSquare size={14} />}
            href="docs.taoshi.io"
            target="_blank"
          >
            Support
          </Button>
          <Button
            className="text-sm font-normal bg-primary-700"
            component={Link}
            href="/dashboard"
          >
            Dashboard
          </Button>
        </Group>
      </Group>
    </Group>
  );
}
