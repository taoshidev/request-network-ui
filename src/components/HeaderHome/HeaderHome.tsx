import { Group, Anchor, Button } from "@mantine/core";
import Link from "next/link";
import {
  IconHelpSquare,
  IconScript,
  IconChartBar,
  IconFileStack,
} from "@tabler/icons-react";

export function HeaderHome() {
  return (
    <Group className="h-full p-4">
      <Group className="flex-1 justify-between">
        <Anchor
          className="mr-1 font-adlam-display font-bold text-2xl text-primary-900"
          component={Link}
          href="/dashboard"
        >
          taoshi
        </Anchor>
        <Group className="ml-1" visibleFrom="sm">
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
            href="https://ipfs.filebase.io/ipfs/QmWuD5B77xBf6TE3mMUdAMaXeqVf6JkUYzhpW85W8jiAZY"
            target="_blank"
          >
            Whitepaper
          </Button>
          <Button
            className="text-sm text-primary-800 font-normal"
            component={Link}
            leftSection={<IconFileStack size={14} />}
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
            className="text-sm font-normal bg-primary-900"
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
