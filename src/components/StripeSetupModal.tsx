import {
  Modal,
  Button,
  Text,
  Divider,
  Box,
  Title,
  Grid,
  CopyButton,
  Group,
} from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";

export default function StripeSetupModal({
  opened,
  stripe,
  onConfirm,
  onCancel,
}: {
  opened: boolean;
  stripe: any;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  const localDisabled =
    !stripe?.enrollmentSecret ||
    !stripe?.stripeKey ||
    !stripe?.stripePublicKey ||
    !stripe?.stripeWebhooksKey;
  const liveDisabled = !stripe?.webhook || !stripe.webhookEvents;

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Confirm Stripe Configuration"
      centered
      size="xl"
    >
      <Grid className="mb-3">
        <Grid.Col span={6}>
          <Title order={3}>Server Environment</Title>
          <Text className="">
            ENROLLMENT_SECRET: {stripe?.enrollmentSecret ? "Yes" : "No"}
          </Text>
          <Text className="">
            STRIPE_SECRET_KEY: {stripe?.stripeKey ? "Yes" : "No"}
          </Text>
          <Text className="">
            STRIPE_PUBLIC_KEY: {stripe?.stripePublicKey ? "Yes" : "No"}
          </Text>
          <Text className="">
            STRIPE_WEBHOOKS_KEY: {stripe?.stripeWebhooksKey ? "Yes" : "No"}
          </Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={3}>Stripe Enabled</Title>
          <Text className="">
            Webhooks Enabled: {stripe?.webhooks ? "Yes" : "No"}
          </Text>
          <Text className="">
            Webhooks Events Configured: {stripe?.webhookEvents ? "Yes" : "No"}
          </Text>
          {!stripe?.isHttps && (
            <Text className="">
              It looks like you are in local development mode. Go to your Stripe
              account to set up a local listener if you have not done this yet.
            </Text>
          )}
          {stripe?.newEndpointCreated && (
            <Text className="">
              A new Stripe webhook has been created. Go to your Stripe account
              and find your new webhook. Set the webhook's secret in your
              servers .env file.
            </Text>
          )}
        </Grid.Col>
        {stripe?.webhookEndpoint?.secret && (
          <Grid.Col span={12}>
            <Group gap="xs">
              <Text className="font-bold text-center">
                Stripe Webhook Secret Key
              </Text>
              <CopyButton value={stripe?.webhookEndpoint?.secret}>
                {({ copied, copy }) => (
                  <Button
                    leftSection={<IconCopy size={14} />}
                    variant="subtle"
                    onClick={copy}
                  >
                    <Text size="sm" fw="bold">
                      {copied ? "Copied Key" : stripe?.webhookEndpoint?.secret}
                    </Text>
                  </Button>
                )}
              </CopyButton>
            </Group>
          </Grid.Col>
        )}
        {/* <Text className="">
          Webhook Secret Key: {stripe?.webhookEndpoint?.secret}
        </Text> */}
      </Grid>
      <Divider />
      <Box className="flex justify-end mt-4">
        <Button variant="outline" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={stripe?.isHttps ? liveDisabled : localDisabled}
        >
          Verify Integration
        </Button>
      </Box>
    </Modal>
  );
}
