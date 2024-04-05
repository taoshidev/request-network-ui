"use client";

import { Button, Text, Box, CopyButton, Alert, Modal } from "@mantine/core";
import { IconAlertCircle, IconCopy } from "@tabler/icons-react";

export function KeyModal({
  opened,
  onClose,
  onCopy,
  apiKey,
  title,
  apiSecret = "",
}: {
  opened: boolean;
  onClose: () => void;
  onCopy: (key: "apiKey" | "apiSecret") => void;
  apiKey: string;
  title: string;
  apiSecret: string;
}) {
  const handleCopy = (copy: () => void, key: "apiKey" | "apiSecret") => {
    copy();
    return onCopy?.(key);
  };

  return (
    <Modal centered opened={opened} onClose={onClose} title={title}>
      <Box className="mt-4 mb-8">
        <Box className="mb-8">
          <Alert color="orange" icon={<IconAlertCircle />}>
            <Text className="mb-2 text-xs">
              Please copy and safely store your unique authentication key below.
            </Text>
            <Text className="text-xs">
              This key will not be displayed again.
            </Text>
          </Alert>
        </Box>
        <Box>
          <Text className="text-xs mb-2 font-bold text-center">{title}:</Text>
          <CopyButton value={apiKey}>
            {({ copied, copy }) => (
              <Button
                className="w-full"
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => handleCopy(copy, "apiKey")}
              >
                <Text>{copied ? "Copied key" : apiKey}</Text>
              </Button>
            )}
          </CopyButton>
        </Box>
        <Box className="mt-4">
          <Text className="text-xs mb-2 font-bold text-center">Api Secret Key:</Text>
          <CopyButton value={apiSecret}>
            {({ copied, copy }) => (
              <Button
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => handleCopy(copy, "apiSecret")}
              >
                <Text fw="bold">{copied ? "Copied secret" : apiSecret}</Text>
              </Button>
            )}
          </CopyButton>
        </Box>
      </Box>
      <Box>
        <Button className="w-full" component="a" href="/dashboard">
          Go to Dashboard
        </Button>
      </Box>
    </Modal>
  );
}
