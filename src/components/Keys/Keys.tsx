"use client";

import {
  Container,
  Title,
  Text,
  Box,
  Group,
  Button,
  CopyButton,
} from "@mantine/core";
import dayjs from "dayjs";

import { Settings } from "../Settings";
import { IconCopy } from "@tabler/icons-react";

import styles from "./keys.module.css";

export function Keys({ apiKey, subscription }: { apiKey: any, subscription: any }) {
  const url = apiKey?.meta?.endpoint;

  return (
    <Container>
      <Box my="xl" className={styles.intro} pb="lg">
        <Title className="mb-5">{subscription?.appName}</Title>
        <Text size="xs" mb="sm">
          Created: {dayjs(apiKey?.createdAt).format("MMM DD, YYYY")}
        </Text>

        <Group gap="xs">
          <Text size="sm">Custom Endpoint:</Text>
          <CopyButton value={url}>
            {({ copied, copy }) => (
              <Button
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={copy}
              >
                <Text size="sm" fw="bold">
                  {copied ? "Copied url" : url}
                </Text>
              </Button>
            )}
          </CopyButton>
        </Group>
      </Box>

      <Settings apiKey={apiKey} subscription={subscription} />
    </Container>
  );
}
