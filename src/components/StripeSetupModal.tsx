import { checkForStripe } from "@/actions/payments";
import {
  NOTIFICATION_COLOR,
  NOTIFICATION_ICON,
} from "@/hooks/use-notification";
import {
  Modal,
  Button,
  Text,
  Divider,
  Box,
  Notification,
  Title,
  Grid,
} from "@mantine/core";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function StripeSetupModal({
  opened,
  initialStripe,
  validatorId,
  onConfirm,
  onCancel,
}: {
  opened: boolean;
  initialStripe: any;
  validatorId: string;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  let { data: stripe } = useSWR(
    "/has-stripe",
    async () => await checkForStripe(validatorId as string),
    {
      fallbackData: initialStripe,
      refreshInterval: 5000,
    }
  );

  const requiredEvents = [
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "customer.subscription.deleted",
    "customer.subscription.updated",
  ];
  const [disabled, setDisabled] = useState(true);
  const [missingEnv, setMissingEnv] = useState(true);
  const [missingWebhooks, setMissingWebhooks] = useState(true);
  const [missingWebhookEvents, setMissingWebhookEvents] = useState(true);

  useEffect(() => {
    const missingEnv =
      !stripe?.enrollmentSecret ||
      !stripe?.stripeKey ||
      !stripe?.stripePublicKey ||
      !stripe?.stripeWebhooksKey;
    const missingLiveWebhook = !stripe?.webhooks || !stripe.webhookEvents;
    setMissingEnv(missingEnv);
    setMissingWebhooks(missingWebhooks);
    setMissingWebhookEvents(missingWebhookEvents);
    setDisabled(
      stripe?.isHttps ? missingLiveWebhook || missingEnv : missingEnv
    );
    // eslint-disable-next-line
  }, [stripe]);

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Confirm Stripe Configuration"
      centered
      size="xl"
    >
      <Box className="mb-3 p-3">
        <Text>Your servers current Stripe integration configuration</Text>
        <br />
        {stripe?.error ? (
          <Notification
            className="zoom in shadow-md border border-gray-200 mb-3"
            style={{
              borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
            }}
            icon={NOTIFICATION_ICON.WARNING}
            color={NOTIFICATION_COLOR.WARNING}
            title="Server offline"
            withCloseButton={false}
          >
            <Box className="text-slate-700">
              Server currently offline, waiting for server restart...
            </Box>
          </Notification>
        ) : (
          <>
            {missingEnv && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                title="Server Environment"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  Your server environment is missing:
                  <br />&quot;
                  {[
                    !stripe?.enrollmentSecret && "STRIPE_ENROLLMENT_SECRET",
                    !stripe?.stripeKey && "STRIPE_SECRET_KEY",
                    !stripe?.stripePublicKey && "STRIPE_PUBLIC_KEY",
                    !stripe?.stripeWebhooksKey && "STRIPE_WEBHOOKS_KEY",
                  ]
                    .filter((item) => item)
                    .join('", "')
                    .replace(
                      /,(?=[^,]+$)/,
                      ` and`
                    )}
                  &quot;
                </Box>
              </Notification>
            )}
            {stripe?.isHttps && missingWebhooks && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="Stripe Webhooks"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  The Stripe webhook does not appear to be activated. A webhook
                  will automatically be created if your environment is set up
                  correctly. Make sure you are not missing Stripe credentials in
                  your .env Everything except the &quot;STRIPE_WEBHOOKS_KEY&quot; are
                  required for automatic configuration.
                </Box>
              </Notification>
            )}
            {stripe?.isHttps && !missingWebhooks && missingWebhookEvents && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="Stripe Webhooks"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  The Stripe webhook has been configured incorrectly and is
                  missing events. Configured events should include:
                  <br />&quot;
                  {requiredEvents
                    .join('", "')
                    .replace(
                      /,(?=[^,]+$)/,
                      ` and`
                    )}
                  &quot;
                </Box>
              </Notification>
            )}
            {!stripe?.isHttp && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{ borderLeft: `4px solid ${NOTIFICATION_COLOR.INFO}` }}
                icon={NOTIFICATION_ICON.INFO}
                color={NOTIFICATION_COLOR.INFO}
                title="Local Development"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  It looks like you are in local development mode. Go to your
                  Stripe account to set up a local listener if you have not done
                  this yet.
                </Box>
              </Notification>
            )}
            {!missingWebhooks &&
              !missingWebhookEvents &&
              !stripe?.stripeWebhooksKey && (
                <Notification
                  className="zoom in shadow-md border border-gray-200 mb-3"
                  style={{
                    borderLeft: `4px solid ${NOTIFICATION_COLOR.INFO}`,
                  }}
                  icon={NOTIFICATION_ICON.INFO}
                  color={NOTIFICATION_COLOR.INFO}
                  title="New Webhook Created"
                  withCloseButton={false}
                >
                  <Box className="text-slate-700">
                    A new Stripe webhook has been created. Go to your Stripe
                    account and find your new webhook. Set the webhook&apos;s
                    secret in your servers .env file.
                  </Box>
                </Notification>
              )}
            {!disabled && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.SUCCESS}`,
                }}
                icon={NOTIFICATION_ICON.SUCCESS}
                color={NOTIFICATION_COLOR.SUCCESS}
                title="Configuration Complete"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  Stripe is currently configured correctly.
                </Box>
              </Notification>
            )}
          </>
        )}
      </Box>
      <Divider />
      <Box className="flex justify-end mt-4">
        <Button variant="outline" onClick={onCancel} className="mr-2">
          Cancel
        </Button>
        <Button onClick={onConfirm} disabled={disabled}>
          Verify Integration
        </Button>
      </Box>
    </Modal>
  );
}
