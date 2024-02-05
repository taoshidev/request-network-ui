import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Burger,
  Group,
  Anchor,
  Menu,
  UnstyledButton,
  Indicator,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLogout, IconUser } from "@tabler/icons-react";

export function Header() {
  const supabase = createClientComponentClient();
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      router.push("/auth/sign-in");
    }
  };

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Link href="/dashboard">Taoshi</Link>
        <Group ml="xl" visibleFrom="sm">
          <Anchor component={Link} href="docs.taoshi.io" target="_blank">
            <Indicator position="top-start" size={6}>
              Status
            </Indicator>
          </Anchor>
          <Anchor component={Link} href="docs.taoshi.io" target="_blank">
            Docs
          </Anchor>
          <Anchor component={Link} href="docs.taoshi.io" target="_blank">
            Help
          </Anchor>
          <Anchor component={Link} href="docs.taoshi.io" target="_blank">
            Support
          </Anchor>
          <Menu position="bottom-end" offset={10}>
            <Menu.Target>
              <UnstyledButton>Settings</UnstyledButton>
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
        </Group>
      </Group>
    </Group>
  );
}
