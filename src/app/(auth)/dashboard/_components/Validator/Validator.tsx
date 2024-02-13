"use client";

import { Container, Title, Tabs, rem, Box, Text } from "@mantine/core";
import "@mantine/dates/styles.css";
import { IconSettings, IconGraph } from "@tabler/icons-react";
import { isEmpty } from "lodash";

import { Settings } from "../Settings";

import styles from "./validator.module.css";

interface ValidatorProps {
  user: any;
  validator: any;
}

export function Validator({ user, validator }: ValidatorProps) {
  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    <Container>
      {isEmpty(validator) ? (
        <>
          <Box my="xl">
            <Title order={2}>Add your Validator Settings.</Title>
            <Text>Add your Validator Settings to start sending requests.</Text>
          </Box>

          <Settings user={user} validator={validator} />
        </>
      ) : (
        <>
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
              <Title mt="xl" order={2}>
                General Settings
              </Title>
              <Settings withSchema user={user} validator={validator} />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </Container>
  );
}
