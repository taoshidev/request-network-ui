"use client";

import { Button, Text, Box, CopyButton, Alert, Modal } from "@mantine/core";
import { IconAlertCircle, IconCopy } from "@tabler/icons-react";

export type keyType = "apiKey" | "apiSecret" | "walletAddress" | "endpoint";

const KeyCopyButton = ({
  title,
  value,
  type,
  onCopy,
}: {
  title: string;
  value: string;
  type: keyType;
  onCopy: (key: keyType) => void;
}) => {
  return (
    <Box className="mt-4">
      <Text className="text-xs mb-2 font-bold text-center">{title}</Text>
      <CopyButton value={value}>
        {({ copied, copy }) => (
          <Button
            className="flex w-full"
            leftSection={<IconCopy size={14} />}
            variant="subtle"
            onClick={() => {
              copy();
              onCopy(type);
            }}
          >
            <Text fw="bold">{copied ? `Copied ${type}` : value}</Text>
          </Button>
        )}
      </CopyButton>
    </Box>
  );
};

export function KeyModal({
  opened,
  onClose,
  onCopy,
  apiKey,
  title,
  apiSecret = "",
  walletAddress = "",
  walletAddressTitle = "",
  endpointTitle = "",
  endpoint = "",
}: {
  opened: boolean;
  onClose: () => void;
  onCopy: (key: keyType) => void;
  apiKey: string;
  title: string;
  apiSecret: string;
  walletAddress?: string;
  walletAddressTitle?: string;
  endpointTitle?: string;
  endpoint?: string;
}) {
  const handleCopy = (copy: () => void, key: keyType) => {
    copy();
    return onCopy?.(key);
  };

  return (
    <Modal size="xl" centered opened={opened} onClose={onClose} title={title}>
      <Box className="mt-4 mb-8">
        <Box className="mb-8">
          <Alert
            className="shadow-sm mb-7 border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-2 text-md">
              Please copy and safely store your unique authentication key below.
            </Text>
            <Text className="text-md">
              This key will not be displayed again.
            </Text>
          </Alert>
        </Box>
        <KeyCopyButton
          title={title}
          value={apiKey}
          type="apiKey"
          onCopy={onCopy}
        />
        <KeyCopyButton
          title="Api Secret Key"
          value={apiSecret}
          type="apiSecret"
          onCopy={onCopy}
        />
        {walletAddressTitle && (
          <KeyCopyButton
            title={walletAddressTitle}
            value={walletAddress}
            type="walletAddress"
            onCopy={onCopy}
          />
        )}
        {endpointTitle && (
          <KeyCopyButton
            title={endpointTitle}
            value={endpoint}
            type="endpoint"
            onCopy={onCopy}
          />
        )}
      </Box>
      <Box>
        <Button
          className="w-full"
          component="a"
          href="/dashboard"
          onClick={onClose}
        >
          Go to Dashboard
        </Button>
      </Box>
    </Modal>
  );
}
