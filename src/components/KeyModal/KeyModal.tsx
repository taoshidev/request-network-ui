"use client";

import {
  Button,
  Text,
  Box,
  CopyButton,
  Alert,
  Modal,
  Code,
} from "@mantine/core";
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
            <Text fw="bold">{copied ? `Copied ${title}` : value}</Text>
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
  isConsumer = false,
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
  isConsumer?: boolean;
}) {
  const handleCopy = (copy: () => void, key: keyType) => {
    copy();
    return onCopy?.(key);
  };

  return (
    <Modal
      size="xl"
      centered
      opened={opened}
      onClose={onClose}
      title={title}
      closeOnClickOutside={false}
    >
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
      {isConsumer && (
        <>
          <CopyButton
            value={`wget --quiet \\\r\n--method GET \\\r\n--header 'Accept: */*' \\\r\n--header 'Content-Type: application/json' \\\r\n--header 'x-taoshi-consumer-request-key: ${apiKey}' \\\r\n--output-document \\`}
          >
            {({ copied, copy }) => (
              <Button
                className="flex w-full"
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => copy()}
              >
                <Text fw="bold">
                  {copied ? `Copied wget` : "Copy wget command"}
                </Text>
              </Button>
            )}
          </CopyButton>
          <Box className="bg-gray-50 mb-3 p-3 shadow-md">
            <Text className="text-xs mb-2 font-bold text-center">
              wget command
            </Text>
            <Code className="bg-transparent">
              wget --quiet \<br />
              --method GET \<br />
              --header &apos;Accept: */*&apos; \<br />
              --header &apos;Content-Type: application/json&apos; \<br />
              --header &apos;x-taoshi-consumer-request-key: {apiKey}&apos; \
              <br />
              --output-document \<br />- {endpoint}
            </Code>
          </Box>
          <CopyButton
            value={`curl -L -X GET "${endpoint}" \\\r\n-H "Content-Type: application/json" \\\r\n-H "x-taoshi-consumer-request-key: ${apiKey}"`}
          >
            {({ copied, copy }) => (
              <Button
                className="flex w-full"
                leftSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => copy()}
              >
                <Text fw="bold">
                  {copied ? `Copied curl` : "Copy curl command"}
                </Text>
              </Button>
            )}
          </CopyButton>
          <Box className="bg-gray-50 mb-3 p-3 shadow-md">
            <Text className="text-xs mb-2 font-bold text-center">
              curl command
            </Text>
            <Code className="bg-transparent">
              curl -L -X GET &quot;{endpoint}&quot; \
              <br />
              -H &quot;Content-Type: application/json&quot; \<br />
              -H &quot;x-taoshi-consumer-request-key:
              req_xxxxxxxxxxxxxxxxxxxxxxxx&quot;
            </Code>
          </Box>
        </>
      )}
      <Box className="sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
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
