import { checkForPayPal } from "@/actions/payments";
import { PayPalCheckType } from "@/db/types/paypal-check";
import {
  NOTIFICATION_COLOR,
  NOTIFICATION_ICON,
} from "@/hooks/use-notification";
import { Modal, Button, Text, Divider, Box, Notification } from "@mantine/core";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function PayPalSetupModal({
  opened,
  initialPayPal,
  validatorId,
  onConfirm,
  onCancel,
}: {
  opened: boolean;
  initialPayPal: Partial<PayPalCheckType>;
  validatorId: string;
  onConfirm?: () => void;
  onCancel: () => void;
}) {
  let { data: payPal } = useSWR(
    "/has-payPal",
    async () => await checkForPayPal(validatorId as string),
    {
      fallbackData: initialPayPal,
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
      !payPal?.enrollmentSecret ||
      !payPal?.payPalSecretKey ||
      !payPal?.payPalClientId ||
      !payPal?.payPalWebhookId;
    const missingLiveWebhook = !payPal?.webhooks || !payPal?.webhookEvents;

    setMissingEnv(missingEnv);
    setMissingWebhooks(!payPal?.webhooks);
    setMissingWebhookEvents(!payPal?.webhookEvents);
    setDisabled(
      (payPal?.isHttps ? missingLiveWebhook || missingEnv : missingEnv) ||
        payPal?.rnUrl !== process.env.NEXT_PUBLIC_DOMAIN        
    );
    // eslint-disable-next-line
  }, [payPal]);

  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Confirm PayPal Configuration"
      centered
      size="xl"
    >
      <Box className="mb-3 p-3">
        <Text>Your servers current PayPal integration configuration</Text>
        <br />
        {payPal?.error ? (
          <>
            {payPal.error !== "Unauthorized: Signature check failed" ? (
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
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="Server Configuration Error"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  Your server appears to be on-line however it is not configured
                  correctly. Check your env variables and make sure they have
                  been set correctly.
                </Box>
              </Notification>
            )}
          </>
        ) : (
          <>
            {payPal?.rnUrl !== process.env.NEXT_PUBLIC_DOMAIN && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="Server URL Match Error"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  Server &quot;REQUEST_NETWORK_UI_URL&quot; shout be set to
                  &quot;{process.env.NEXT_PUBLIC_DOMAIN}&quot; but is set to
                  &quot;{payPal?.rnUrl}&quot;.
                </Box>
              </Notification>
            )}
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
                  <br />
                  &quot;
                  {[
                    !payPal?.enrollmentSecret && "ENROLLMENT_SECRET",
                    !payPal?.payPalSecretKey && "PAYPAL_CLIENT_SECRET",
                    !payPal?.payPalClientId && "PAYPAL_CLIENT_ID",
                    !payPal?.payPalWebhookId && "PAYPAL_WEBHOOK_ID",
                  ]
                    .filter((item) => item)
                    .join('", "')
                    .replace(/,(?=[^,]+$)/, ` and`)}
                  &quot;
                </Box>
              </Notification>
            )}
            {payPal?.isHttps && missingWebhooks && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="PayPal Webhooks"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  The PayPal webhook does not appear to be activated. A webhook
                  will automatically be created if your environment is set up
                  correctly. Make sure you are not missing PayPal credentials in
                  your .env Everything except the
                  &quot;PAYPAL_WEBHOOK_ID&quot; are required for automatic
                  configuration.
                </Box>
              </Notification>
            )}
            {/* {payPal?.isHttps && !missingWebhooks && missingWebhookEvents && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{
                  borderLeft: `4px solid ${NOTIFICATION_COLOR.WARNING}`,
                }}
                icon={NOTIFICATION_ICON.WARNING}
                color={NOTIFICATION_COLOR.WARNING}
                title="PayPal Webhooks"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  The PayPal webhook has been configured incorrectly and is
                  missing events. Configured events should include:
                  <br />
                  &quot;
                  {requiredEvents.join('", "').replace(/,(?=[^,]+$)/, ` and`)}
                  &quot;
                </Box>
              </Notification>
            )} */}
            {!payPal?.isHttps && (
              <Notification
                className="zoom in shadow-md border border-gray-200 mb-3"
                style={{ borderLeft: `4px solid ${NOTIFICATION_COLOR.INFO}` }}
                icon={NOTIFICATION_ICON.INFO}
                color={NOTIFICATION_COLOR.INFO}
                title="Local Development"
                withCloseButton={false}
              >
                <Box className="text-slate-700">
                  It looks like you are in local development mode.
                </Box>
              </Notification>
            )}
            {!missingWebhooks &&
              !missingWebhookEvents &&
              !payPal?.payPalWebhookId && (
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
                    The webhook may be configured incorrectly verify that your webhook has been created and configured correctly. Set the webhook&apos;s
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
                  PayPal is currently configured correctly. Click &quot;Verify
                  Integration&quot; to complete PayPal configuration.
                </Box>
              </Notification>
            )}
          </>
        )}
      </Box>
      <Divider />
      <Box className="flex justify-end mt-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
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
