"use client";

import { Container, Title, Tabs, rem } from "@mantine/core";
import { IconSettings, IconGraph } from "@tabler/icons-react";

import { Settings } from "./Settings";

import styles from "./validator.module.css";

interface ValidatorProps {
  user: any;
}

export function Validator({ user }: ValidatorProps) {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Container>
      <Title my="xl">Validator Settings</Title>
      <Tabs defaultValue="statistics">
        <Tabs.List>
          <Tabs.Tab
            value="statistics"
            leftSection={<IconGraph style={iconStyle} />}
          >
            Statistics
          </Tabs.Tab>
          <Tabs.Tab
            value="settings"
            leftSection={<IconSettings style={iconStyle} />}
          >
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="statistics">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="settings">
          <Settings user={user} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
