"use client";

import {
  Container,
  Title,
  Text,
  Box,
  Group,
  Button,
  CopyButton,
  Code,
} from "@mantine/core";
import dayjs from "dayjs";

import { Settings } from "./Settings";
import { IconCopy } from "@tabler/icons-react";

export function Subscription({
  apiKey,
  subscription,
  consumerApiUrls
}: {
  apiKey: any;
  subscription: any;
  consumerApiUrls: string[]
}) {
  const url = apiKey?.meta?.endpoint;

  return (
    <Container>
      <Box my="xl">
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
        <Box className="bg-gray-50 my-3 p-3 pl-9 shadow-md -indent-6">
          <Code className="bg-transparent">
            wget --quiet \ --method GET \<br />
            --header &apos;Accept: */*&apos; \<br />
            --header &apos;Content-Type: application/json&apos; \<br />
            --header &apos;x-taoshi-consumer-request-key:
            req_xxxxxxxxxxxxxxxxxxxxxxxx&apos; \<br />
            --output-document \<br />
            - {url}
          </Code>
        </Box>
        <Box className="bg-gray-50 mb-3 p-3 pl-9 shadow-md -indent-6">
          <Code className="bg-transparent">
            curl -L -X GET &quot;{url}&quot; \
            <br />
            -H &quot;Content-Type: application/json&quot; \<br />
            -H &quot;x-taoshi-consumer-request-key: req_xxxxxxxxxxxxxxxxxxxxxxxx&quot;
          </Code>
        </Box>
      </Box>

      <Settings apiKey={apiKey} subscription={subscription} consumerApiUrls={consumerApiUrls} />
    </Container>
  );
}
