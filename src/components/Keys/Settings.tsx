"use client";

import { useEffect, useMemo, useState } from "react";
import NextImage from "next/image";
import {
  Title,
  Text,
  Group,
  Image,
  Box,
  Button,
  TextInput,
  Modal,
  Alert,
  CopyButton,
  Grid,
  Card,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import {
  IconAlertCircle,
  IconClockDollar,
  IconCopy,
} from "@tabler/icons-react";
import payPalBtn from "@/assets/paypal-1.svg";
import stripeBtn from "@/assets/stripe.svg";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deleteKey, updateKey } from "@/actions/keys";
import { TAOSHI_REQUEST_KEY } from "@/constants";
import { useNotification } from "@/hooks/use-notification";
import { StatTable } from "../StatTable";
import { cancelSubscription, requestPayment } from "@/actions/payments";
import { ConfirmModal } from "../ConfirmModal";
import { updateSubscription, fetchProxyService } from "@/actions/subscriptions";
import CurrencyFormatter from "../Formatters/CurrencyFormatter";
import clsx from "clsx";
import TierPurchaseOption from "./TierPurchaseOption";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";

const updateSchema = z.object({
  name: z
    .string()
    .regex(/^[^\s]*$/, { message: "Spaces are not allowed" })
    .min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof updateSchema>;

export function Settings({
  apiKey,
  subscription,
}: {
  apiKey: any;
  subscription: any;
}) {
  const isFree = useMemo(
    () => +subscription?.service?.price === 0,
    [subscription]
  );
  const stripeEnabled = useMemo(
    () => !!subscription?.validator?.stripeEnabled,
    [subscription]
  );
  const stripeLiveMode = useMemo(
    () => !!subscription?.validator?.stripeLiveMode,
    [subscription]
  );
  const payPalEnabled = useMemo(
    () => !!subscription?.validator?.payPalEnabled,
    [subscription]
  );
  const [opened, { open, close }] = useDisclosure(false);
  const [unSubOpened, { open: unSubOpen, close: unSubClose }] =
    useDisclosure(false);
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState("");
  const [active, setActive] = useState(false);
  const router = useRouter();
  const [key]: Array<any> = useLocalStorage({
    key: TAOSHI_REQUEST_KEY,
  });
  const [tiers, setTiers] = useState<
    {
      from: number;
      to: number;
      price: number;
    }[]
  >([]);

  useEffect(() => {
    if (subscription?.service?.tiers?.length > 0) {
      setTiers(subscription.service.tiers);
    }
  }, [subscription]);

  // refresh page when it comes back into view
  useEffect(() => {
    const fetchService = async () => {
      const proxyService = await fetchProxyService(
        subscription?.validator,
        subscription?.proxyServiceId
      );
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
        if (stripeEnabled) setLoading("");
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
  const deleteUnkey = async () => {
    const res = await deleteKey({ keyId: apiKey?.id });
    if (res?.status !== 204) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
  };

  const onUpdateKey: SubmitHandler<User> = async (values) => {
    setLoading("update-key");
    const res = await updateKey({
      keyId: apiKey?.id,
      params: { name: values.name },
    });

    if (res?.status !== 200) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
    setLoading("");
    router.refresh();
    setTimeout(() => router.back(), 1000);
  };

  const handleCopy = (copy: () => void) => {
    localStorage.removeItem(TAOSHI_REQUEST_KEY);
    copy();
  };

  const sendPaymentRequest = async (url = "subscribe") => {
    const requestPaymentRes = await requestPayment(
      subscription.proxyServiceId,
      window.location.pathname,
      subscription?.service?.price
    );

    if (
      requestPaymentRes?.subscription?.endpoint?.validator?.baseApiUrl &&
      requestPaymentRes.token
    ) {
      window.open(
        `${requestPaymentRes.subscription.endpoint.validator.baseApiUrl}/${url}?token=${requestPaymentRes.token}`,
        "_blank"
      );
    }
  };

  const unsubscribe = async () => {
    const unSubRes = await cancelSubscription(subscription.proxyServiceId);
    notifySuccess(`Subscription cancelled successfully`);
    unSubClose();
    setLoading("");
  };

  const stripePayment = () => {
    setLoading("stripe-payment");
    subscription?.active ? unSubOpen() : sendPaymentRequest();
  };

  const payPalPayment = () => {
    setLoading("paypal-payment");
    false ? unSubOpen() : sendPaymentRequest("paypal-subscribe");
  };

  const handleDeleteSubscription = async () => {
    setLoading("delete-subscription");
    if (subscription.service.paymentType === PAYMENT_TYPE.SUBSCRIPTION)
      await unsubscribe();
    await deleteUnkey();
    await updateSubscription({
      id: subscription?.id,
      active: false,
      deletedAt: new Date(),
    });
    setLoading("");
    notifySuccess("Subscription deleted successfully");
    setTimeout(() => router.back(), 1000);
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title={
          subscription.service.paymentType !== PAYMENT_TYPE.PAY_PER_REQUEST
            ? "Are you sure you want to delete subscription?"
            : "Are you sure you want to delete access keys?"
        }
      >
        <Box mb="lg">
          <Text>
            Any applications using this project&apos;s keys will no longer be
            able to access this Taoshi Api.
          </Text>{" "}
          <Text>This cannot be undone.</Text>
        </Box>
        <Box className="grid grid-cols-2 gap-2 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
          <Button w="100%" onClick={close} variant="outline">
            No, Cancel
          </Button>

          <Button
            w="100%"
            loading={loading === "delete-subscription"}
            onClick={handleDeleteSubscription}
          >
            Yes, Delete
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
        <Box my="xl" py="md">
          <Box mb="lg">
            <Title mb="md" order={2}>
              Authentication Key
            </Title>

            <Alert
              className="shadow-sm border-gray-200"
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
            className="shadow-sm border-gray-200"
            variant="light"
            color={subscription?.active ? "#33ad47" : "orange"}
            title={
              subscription?.active
                ? "Billing Information"
                : isFree
                ? "Endpoint Inactive"
                : "Pay For Endpoint"
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
                      <Text>
                        Price:{" "}
                        {subscription.service.paymentType !==
                        PAYMENT_TYPE.PAY_PER_REQUEST ? (
                          <CurrencyFormatter
                            price={subscription?.service?.price}
                            currencyType={subscription?.service?.currencyType}
                          />
                        ) : (
                          "Pay Per Request"
                        )}
                      </Text>
                      <Text>
                        Validator: {subscription?.endpoint?.validator?.name}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}></Grid.Col>
                  </Grid>
                </Box>
              ) : stripeEnabled && !isFree ? (
                <Box>Pay for endpoint use using Stripe.</Box>
              ) : (
                <Box>Subscription is not active.</Box>
              )}
              <Group justify="flex-end" mt="lg">
                {!subscription?.active && payPalEnabled && !isFree && (
                  <Button
                    onClick={payPalPayment}
                    loading={loading === "paypal-payment"}
                    type="button"
                    variant="default"
                    className="drop-shadow-md"
                  >
                    <Image
                      component={NextImage}
                      src={payPalBtn}
                      w="auto"
                      h={25}
                      alt="PayPal Subscribe"
                    />
                  </Button>
                )}
                {stripeEnabled &&
                  !isFree &&
                  (stripeLiveMode ||
                    process.env.NEXT_PUBLIC_NODE_ENV !== "production") && (
                    <Button
                      onClick={stripePayment}
                      loading={loading === "stripe-payment"}
                      type="button"
                      variant={subscription?.active ? "orange" : "default"}
                      className={clsx(
                        !subscription?.active && "drop-shadow-md"
                      )}
                    >
                      {subscription?.active ? (
                        "Cancel Subscription"
                      ) : (
                        <Image
                          component={NextImage}
                          src={stripeBtn}
                          w="auto"
                          h={30}
                          alt="Stripe Subscribe"
                        />
                      )}
                    </Button>
                  )}
              </Group>
              {!isFree &&
                !stripeLiveMode &&
                process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
                  <Text>
                    {subscription?.endpoint?.validator?.name} is not currently
                    configured to accept live payments. Please contact support.
                  </Text>
                )}
            </Box>
          </Alert>
        </Box>
      )}

      <Box my="xl">
        {tiers.length > 0 && <TierPurchaseOption subscription={subscription} />}
      </Box>

      <Card className="shadow-sm border-gray-200" withBorder my="xl">
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
            <Button
              loading={loading === "update-key"}
              type="submit"
              variant="primary"
            >
              Update Name
            </Button>
          </Group>
        </Box>
      </Card>
      <Card className="shadow-sm border-gray-200" withBorder>
        <StatTable data={apiKey} />
      </Card>
      <Box mt="xl">
        <Alert
          className="shadow-sm border-gray-200"
          variant="light"
          color="orange"
          title={
            subscription.service.paymentType !== PAYMENT_TYPE.PAY_PER_REQUEST
              ? "Delete Subscription"
              : "Delete Key"
          }
          icon={<IconAlertCircle />}
        >
          <Box>
            <Box>
              Any applications using this project&apos;s keys will no longer be
              able to access the Taoshi&apos;s Api.
            </Box>
            <Group justify="flex-end" mt="lg">
              <Button variant="orange" onClick={open}>
                {subscription.service.paymentType !==
                PAYMENT_TYPE.PAY_PER_REQUEST
                  ? "Delete Subscription"
                  : "Delete Key"}
              </Button>
            </Group>
          </Box>
        </Alert>
      </Box>
    </>
  );
}
