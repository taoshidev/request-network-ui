import { Group, Anchor, Button } from "@mantine/core";
import Link from "next/link";
import {
  IconHelpSquare,
  IconScript,
  IconChartBar,
  IconFileStack,
  IconCode,
} from "@tabler/icons-react";

export function HeaderHome({
  startLink = "/dashboard",
}: {
  startLink?: string;
}) {
  return (
    <div className="h-full py-4">
      <div className="flex-1 flex justify-between">
        <Anchor
          className="mr-1 font-adlam-display font-bold text-2xl text-white"
          component={Link}
          href="/dashboard"
        >
          taoshi
        </Anchor>
        <Group className="ml-1" visibleFrom="sm">
          <Button
            className="text-sm font-normal"
            component={Link}
            leftSection={<IconChartBar size={14} />}
            href="docs.taoshi.io"
            target="_blank"
          >
            Status
          </Button>
          <Button
            className="text-sm font-normal"
            component={Link}
            leftSection={<IconScript size={14} />}
            href="https://ipfs.filebase.io/ipfs/QmWuD5B77xBf6TE3mMUdAMaXeqVf6JkUYzhpW85W8jiAZY"
            target="_blank"
          >
            Whitepaper
          </Button>
          <Button
            className="text-sm font-normal"
            component={Link}
            leftSection={<IconFileStack size={14} />}
            href="/documentation"
          >
            Docs
          </Button>
          <Button
            className="text-sm font-normal"
            component={Link}
            leftSection={<IconCode size={14} />}
            href="/contributing"
          >
            Contribute
          </Button>
          <Button
            className="text-sm font-normal"
            component={Link}
            leftSection={<IconHelpSquare size={14} />}
            href="mailto: lphan@taoshi.io"
            target="_blank"
          >
            Support
          </Button>
          <Button
            variant="white"
            className="text-sm font-normal"
            component={Link}
            href={startLink}
            data-cy="btn-dashboard"
          >
            Dashboard
          </Button>
        </Group>
      </div>
    </div>
  );
}
