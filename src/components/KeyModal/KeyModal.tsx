"use client";

import React, { ReactNode } from "react";
import {
  Button,
  Group,
  Text,
  Box,
  Title,
  CopyButton,
  Alert,
  Modal,
} from "@mantine/core";
import { IconAlertCircle, IconCopy } from "@tabler/icons-react";
import styles from "./key-modal.module.css";

export function KeyModal({
  opened,
  close,
  onCopy,
  apiKey,
  keyTitle,
  modalTitle,
  Action,
}: {
  opened: boolean;
  close: () => void;
  onCopy: () => void;
  apiKey: string;
  keyTitle: string;
  modalTitle: string;
  Action?: ReactNode;
}) {
  const handleCopy = (copy: () => void) => {
    copy();
    return onCopy?.();
  };

  return (
    <Modal centered opened={opened} onClose={close} title={modalTitle}>
      <Box my="sm" className={styles["one-time"]}>
        <Box mb="lg">
          <Title mb="md" order={2}>
            {keyTitle}
          </Title>
          <Alert color="orange" radius="0" title="" icon={<IconAlertCircle />}>
            <Text size="sm">
              Please copy and safely store your unique authentication key below.
            </Text>
            This key will not be displayed again.
          </Alert>
        </Box>
        <Group gap="xs">
          <Text>{keyTitle}:</Text>
          <CopyButton value={apiKey}>
            {({ copied, copy }) => (
              <Button
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => handleCopy(copy)}
              >
                <Text fw="bold">{copied ? "Copied key" : apiKey}</Text>
              </Button>
            )}
          </CopyButton>
        </Group>
      </Box>
      {Action}
    </Modal>
  );
}
