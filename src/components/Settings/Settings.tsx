"use client";

import { useEffect, useState } from "react";
import {
  Title,
  Text,
  Group,
  Box,
  Button,
  TextInput,
  Modal,
  Alert,
  CopyButton,
  Grid,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconClockDollar,
  IconCopy,
} from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deleteKey, updateKey } from "@/actions/keys";
import { TAOSHI_REQUEST_KEY } from "@/constants";
import styles from "./settings.module.css";
import { useNotification } from "@/hooks/use-notification";
import { StatTable } from "../StatTable";
import { cancelSubscription, requestPayment } from "@/actions/payments";
import { ConfirmModal } from "../ConfirmModal";
import { sendToProxy } from "@/actions/apis";
import { updateSubscription } from "@/actions/subscriptions";

const updateSchema = z.object({
  name: z
    .string()
    .regex(/^[^\s]*$/, { message: "Spaces are not allowed" })
    .min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof updateSchema>;

const fetchProxyService = async (validator, proxyServiceId) => {
  const res = await sendToProxy({
    endpoint: {
      url: validator?.baseApiUrl!,
      method: "POST",
      path: `${validator?.apiPrefix}/services/query`,
    },
    validatorId: validator?.id!,
    data: {
      where: [
        {
          type: "eq",
          column: "id",
          value: proxyServiceId!,
        },
      ],
    },
  });

  if (res?.error) {
    return {};
  }
  return res?.data?.[0] || {};
};

export function Settings({
  apiKey,
  subscription,
}: {
  apiKey: any;
  subscription: any;
}) {
  const [disabled, setDisabled] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [unSubOpened, { open: unSubOpen, close: unSubClose }] =
    useDisclosure(false);
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const router = useRouter();
  const [key]: Array<any> = useLocalStorage({
    key: TAOSHI_REQUEST_KEY,
  });

  // refresh page when it comes back into view
  useEffect(() => {
    const fetchService = async () => {
      if (
        proxyService?.subscriptionId &&
        proxyService.active !== subscription?.active
      ) {
        return await updateSubscription({
          id: proxyService.subscriptionId,
          active: proxyService.active,
        });
      }
    };

    const onFocus = async (event) => {
      if (!active && document.visibilityState == "visible") {
        setActive(true);
        setDisabled(false);
        await fetchService();
        router.refresh();
      } else {
        setActive(false);
      }
    };

    const cleanup = () =>
      window.removeEventListener("visibilitychange", onFocus);

    window.addEventListener("visibilitychange", onFocus);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    register,
    handleSubmit: handleUpdateKey,
    formState: { isValid, errors },
  } = useForm<User>({
    mode: "onChange",
    resolver: zodResolver(updateSchema),
  });
  const handleDeleteKey = async () => {
    setLoading(true);
    const res = await deleteKey({ keyId: apiKey?.id });
    if (res?.status !== 204) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
    setLoading(false);

    router.push("/dashboard");
  };

  const onUpdateKey: SubmitHandler<User> = async (values) => {
    setLoading(true);
    const res = await updateKey({
      keyId: apiKey?.id,
      params: { name: values.name },
    });

    if (res?.status !== 200) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
    setLoading(false);
    router.refresh();
    setTimeout(() => router.back(), 1000);
  };

  const handleCopy = (copy: () => void) => {
    localStorage.removeItem(TAOSHI_REQUEST_KEY);
    copy();
  };

  const sendPaymentRequest = async () => {
    const requestPaymentRes = await requestPayment(
      subscription.proxyServiceId,
      window.location.pathname
    );

    if (
      requestPaymentRes?.subscription?.endpoint?.validator?.baseApiUrl &&
      requestPaymentRes.token
    ) {
      window.open(
        `${requestPaymentRes.subscription.endpoint.validator.baseApiUrl}/subscribe?token=${requestPaymentRes.token}`,
        "_blank"
      );
    }
  };

  const unsubscribe = async () => {
    const unSubRes = await cancelSubscription(subscription.proxyServiceId);
    notifySuccess(`Subscription cancelled successfully`);
    unSubClose();
    setDisabled(false);
  };

  const stripePayment = () => {
    setDisabled(true);
    subscription?.active ? unSubOpen() : sendPaymentRequest();
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Are you sure you want to delete API Key?"
      >
        <Box mb="lg">
          Deleting will remove access to Taoshi for this project immediately.
          This cannot be undone.
        </Box>
        <Box>
          <Button w="100%" loading={loading} onClick={handleDeleteKey}>
            Yes, Delete API Key
          </Button>
        </Box>
      </Modal>

      <ConfirmModal
        opened={unSubOpened}
        title="Confirm Unsubscribe"
        message="Are you sure you want to unsubscribe. Any applications using this project's keys will no longer be
        able to access this Taoshi API."
        onConfirm={unsubscribe}
        onCancel={unSubClose}
      />

      {key && key.id && (
        <Box my="xl" py="md" className={styles["one-time"]}>
          <Box mb="lg">
            <Title mb="md" order={2}>
              Authentication Key
            </Title>

            <Alert
              className="shadow-sm"
              color="orange"
              radius="0"
              title=""
              icon={<IconAlertCircle />}
            >
              <Text size="sm">
                Please copy and safely store your unique, one-time
                authentication key below.
              </Text>
              This key will not be displayed again.
            </Alert>
          </Box>

          <Group gap="xs">
            <Text>Authentication Key:</Text>
            <CopyButton value={key.id}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<IconCopy size={14} />}
                  variant="subtle"
                  onClick={() => handleCopy(copy)}
                >
                  <Text fw="bold">{copied ? "Copied key" : key.id}</Text>
                </Button>
              )}
            </CopyButton>
          </Group>
        </Box>
      )}

      {apiKey?.meta?.currencyType === "FIAT" && (
        <Box my="xl">
          <Alert
            className="shadow-sm"
            variant="light"
            color={subscription?.active ? "#33ad47" : "orange"}
            title={
              subscription?.active ? "Billing Information" : "Pay For Endpoint"
            }
            icon={
              subscription?.active ? <IconClockDollar /> : <IconAlertCircle />
            }
          >
            <Box>
              {subscription?.active ? (
                <Box>
                  Endpoint subscription active.
                  <Grid>
                    <Grid.Col span={6}>
                      <Text>Price: ${subscription?.service?.price}</Text>
                      <Text>
                        Validator: {subscription?.endpoint?.validator?.name}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}></Grid.Col>
                  </Grid>
                </Box>
              ) : (
                <Box>Pay for endpoint use using Stripe.</Box>
              )}
              <Group justify="flex-end" mt="lg">
                <Button
                  onClick={stripePayment}
                  disabled={disabled}
                  type="button"
                  variant={subscription?.active ? "light" : "orange"}
                >
                  {subscription?.active
                    ? "Cancel Payment Subscription"
                    : "Set up Payment Subscription"}
                </Button>
              </Group>
            </Box>
          </Alert>
        </Box>
      )}

      <Box my="xl">
        <Title order={2} mb="sm">
          General Settings
        </Title>

        <Box component="form" onSubmit={handleUpdateKey(onUpdateKey)} w="100%">
          <TextInput
            label="Edit Key Name"
            defaultValue={apiKey?.name}
            placeholder={apiKey?.name}
            error={errors.name?.message}
            {...register("name", { required: true })}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" variant="primary">
              Update Name
            </Button>
          </Group>
        </Box>
      </Box>
      <StatTable data={apiKey} />

      {/* <Box my="xl">
          <Title order={2}>Requirements</Title>
        </Box> */}

      <Box my="xl">
        <Alert
          className="shadow-sm"
          variant="light"
          color="orange"
          title="Delete Key"
          icon={<IconAlertCircle />}
        >
          <Box>
            <Box>
              Any applications using this project&apos;s keys will no longer be
              able to access the Taoshi&apos;s API.
            </Box>
            <Group justify="flex-end" mt="lg">
              <Button variant="orange" onClick={open} disabled>
                Delete Key
              </Button>
            </Group>
          </Box>
        </Alert>
      </Box>
    </>
  );
}
