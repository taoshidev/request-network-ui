import { useState, useEffect } from "react";
import NextImage from "next/image";
import {
  Box,
  Button,
  Group,
  Image,
  Modal,
  Text,
  NumberInput,
  Title,
  Card,
  RadioGroup,
  Radio,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNotification } from "@/hooks/use-notification";
import CurrencyFormatter from "../Formatters/CurrencyFormatter";
import FixedFormatter from "../Formatters/FixedFormatter";
import { requestPayment } from "@/actions/payments";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import payPalBtn from "@/assets/paypal-1.svg";
import stripeBtn from "@/assets/stripe.svg";
import clsx from "clsx";

const isFree = false;
const stripeEnabled = true;
const stripeLiveMode = false;
const payPalEnabled = true;
const loading: string = "";

const BUTTON_COUNT = 6;

const calculateIncrements = (tiers) => {
  const paidTiers = tiers.filter((tier) => tier.price > 0);
  if (paidTiers.length === 0) return [];

  const minPaidFrom = Math.min(...paidTiers.map((tier) => tier.from));
  const max = Math.max(...tiers.map((tier) => tier.to));
  const range = max - minPaidFrom;
  let increment;

  if (range > 10000) {
    increment = Math.ceil(range / BUTTON_COUNT / 1000) * 1000;
  } else if (range > 1000) {
    increment = Math.ceil(range / BUTTON_COUNT / 100) * 100;
  } else {
    increment = Math.ceil(range / BUTTON_COUNT / 10) * 10;
  }

  const increments: number[] = [];
  let current = minPaidFrom;

  while (increments.length < BUTTON_COUNT - 1 && current < max) {
    if (current % 2 !== 0) current++;
    increments.push(current);
    current += increment;
  }
  increments.push(max);

  return increments;
};

export default function TierPurchaseOption({ subscription }) {
  const { notifySuccess } = useNotification();
  const [tiers, setTiers] = useState<
    {
      from: number;
      to: number;
      price: number;
    }[]
  >([]);
  const [increments, setIncrements] = useState<number[]>([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [
    confirmModalOpened,
    { open: openConfirmModal, close: closeConfirmModal },
  ] = useDisclosure(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (subscription?.service?.tiers?.length > 0) {
      setTiers(subscription.service.tiers);
    }
  }, [subscription]);

  useEffect(() => {
    if (tiers.length > 0) {
      const calculatedIncrements = calculateIncrements(tiers);
      setIncrements(calculatedIncrements);
    }
  }, [tiers]);

  const handlePurchase = (requestCount) => {
    setSelectedRequest(requestCount);
    setQuantity(1);
    openConfirmModal();
  };

  useEffect(() => {
    if (selectedRequest && quantity) {
      const tier = tiers.find(
        (tier) => selectedRequest >= tier.from && selectedRequest <= tier.to
      );
      if (tier) {
        setTotalPrice(quantity * tier.price);
      }
    }
  }, [quantity, selectedRequest, tiers]);

  const stripePayment = async () => {
    notifySuccess(
      `Purchased ${selectedRequest! * quantity} requests successfully!`
    );
    await sendPaymentRequest();
    closeConfirmModal();
  };

  const payPalPayment = async () => {
    notifySuccess(
      `Purchased ${selectedRequest! * quantity} requests successfully!`
    );
    await sendPaymentRequest("paypal-subscribe");
    closeConfirmModal();
  };

  const sendPaymentRequest = async (url = "subscribe") => {
    const requestPaymentRes = await requestPayment(
      subscription.proxyServiceId,
      window.location.pathname,
      totalPrice.toString(),
      PAYMENT_TYPE.PAY_PER_REQUEST
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

  return (
    <>
      <Card className="shadow-sm border-gray-200" withBorder>
        <Title order={2} mb="sm">
          Purchase More Requests
        </Title>
        <Text>Click a button below to purchase more requests:</Text>
        <Group className="button-group mt-4 grid grid-cols-2 gap-1 xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2">
          {increments.map((increment, index) => {
            const tier = tiers.find(
              (tier) => increment >= tier.from && increment <= tier.to
            );
            return (
              <Button
                key={index}
                className="h-auto p-3"
                variant="orange"
                onClick={() => handlePurchase(increment)}
              >
                <Box className="grid grid-rows-3 gap-y-2">
                  <Text className="font-bold">
                    <FixedFormatter value={increment} /> Req&apos;s
                  </Text>
                  <Text className="font-bold">at</Text>
                  <Text className="font-bold">
                    <CurrencyFormatter
                      price={tier?.price || 0}
                      currencyType={subscription?.service?.currencyType}
                    />
                  </Text>
                </Box>
              </Button>
            );
          })}
        </Group>
      </Card>

      <Modal
        centered
        opened={confirmModalOpened}
        onClose={closeConfirmModal}
        title="Confirm Purchase"
      >
        <Box>
          <Text>
            You are about to purchase{" "}
            <strong>{selectedRequest! * quantity}</strong> requests.
          </Text>
          <Box mt="lg">
            <NumberInput
              label="Quantity"
              value={quantity}
              onChange={(val) => setQuantity(+val ?? 1)}
              min={1}
            />
          </Box>
          <Box mt="lg">
            <Text>
              Total Price:{" "}
              <CurrencyFormatter
                price={totalPrice}
                currencyType={subscription?.service?.currencyType}
              />
            </Text>
          </Box>
          <Group className="flex justify-end mt-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
            <Button onClick={closeConfirmModal} variant="outline">
              Cancel
            </Button>
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
                  className={clsx(!subscription?.active && "drop-shadow-md")}
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
        </Box>
      </Modal>
    </>
  );
}
