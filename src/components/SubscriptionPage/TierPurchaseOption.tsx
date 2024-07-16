import { useState, useEffect, useMemo } from "react";
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
  Tooltip,
  Table,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useNotification } from "@/hooks/use-notification";
import CurrencyFormatter from "../Formatters/CurrencyFormatter";
import FixedFormatter from "../Formatters/FixedFormatter";
import { requestPayment } from "@/actions/payments";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import payPalBtn from "@/assets/paypal-1.svg";
import stripeBtn from "@/assets/stripe.svg";
import { SubscriptionType } from "@/db/types/subscription";

const isFree = false;
const stripeEnabled = true;
const stripeLiveMode = false;
const payPalEnabled = true;
const loading: string = "";

const BUTTON_COUNT = 6;
const SHOW_QUANTITY_INPUT = false;

const calculateIncrements = (tiers) => {
  const paidTiers = tiers.filter((tier) => tier.price > 0);
  if (paidTiers.length === 0) return [];

  const minPaidFrom = Math.min(...paidTiers.map((tier) => tier.to));
  const max = Math.max(...tiers.map((tier) => tier.to));
  const range = max - minPaidFrom;
  let increment;

  if (range > 10000) {
    increment = Math.ceil(range / (BUTTON_COUNT - 1) / 1000) * 1000;
  } else if (range > 1000) {
    increment = Math.ceil(range / (BUTTON_COUNT - 1) / 100) * 100;
  } else {
    increment = Math.ceil(range / (BUTTON_COUNT - 1) / 10) * 10;
  }

  const increments: number[] = [];
  let current = minPaidFrom;

  while (increments.length < BUTTON_COUNT - 1 && current < max) {
    increments.push(current);
    current += increment;
    if (current % 2 !== 0) current++;
  }
  increments.push(max);

  return increments;
};

const calculateCumulativePrice = (tiers, requestCount) => {
  const paidTiers = tiers.filter((tier) => tier.pricePerRequest > 0);
  let remainingRequestCount = requestCount;

  return paidTiers.reduce(
    (acc, tier, i) => {
      const tierPrice = tier?.pricePerRequest?.toFixed(4);
      if (remainingRequestCount > 0) {
        const tierRange = Math.min(
          remainingRequestCount,
          tier.to - (tier.from - 1)
        );
        acc.price += tierRange * tier.pricePerRequest;
        acc.details.push(`(${tierRange} * ${tierPrice})`);
        remainingRequestCount -= tierRange;
        if (i === paidTiers.length - 1 && remainingRequestCount > 0) {
          acc.price += remainingRequestCount * tierPrice;
          acc.details.push(`(${remainingRequestCount} * ${tierPrice})`);
        }
      }
      return acc;
    },
    { price: 0, details: [] }
  );
};

export default function TierPurchaseOption({
  subscription,
  remaining,
  preview = false,
}: {
  subscription: SubscriptionType;
  remaining?: number;
  preview?: boolean;
}) {
  const { notifySuccess } = useNotification();
  const [tiers, setTiers] = useState<
    {
      from: number;
      to: number;
      price: number;
      pricePerRequest: number;
    }[]
  >([]);
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null);
  const [
    confirmModalOpened,
    { open: openConfirmModal, close: closeConfirmModal },
  ] = useDisclosure(false);
  const [
    moreOptionsModalOpened,
    { open: openMoreOptionsModal, close: closeMoreOptionsModal },
  ] = useDisclosure(false);
  const [inputRequestCount, setInputRequestCount] = useState<string | number>(
    1000
  );
  const [quantity, setQuantity] = useState(1);
  const [prevRemaining, setPrevRemaining] = useState(remaining || 0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceDetails, setPriceDetails] = useState<string[]>([]);
  const [precomputedPrices, setPrecomputedPrices] = useState<
    { increment: number; price: number; details: string[] }[]
  >([]);

  useEffect(() => {
    if (subscription?.service?.tiers?.length > 0) {
      setTiers(subscription.service.tiers);
    }
  }, [subscription]);

  useEffect(() => {
    if (remaining && prevRemaining < remaining) {
      if (remaining > 0)
        setTimeout(
          () =>
            notifySuccess(
              `Remaining requests updated. New remaining = ${remaining} requests.`
            ),
          2000
        );
    }

    setPrevRemaining(remaining || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  useEffect(() => {
    const paidTiers = tiers.filter((tier) => tier.price > 0);
    setInputRequestCount(+paidTiers?.[0]?.to || 1000);

    if (tiers.length > 0) {
      const calculatedIncrements = calculateIncrements(tiers);
      const precomputed = calculatedIncrements.map((increment) => {
        const { price, details } = calculateCumulativePrice(tiers, increment);
        return { increment, price, details };
      });
      setPrecomputedPrices(precomputed);
    }
  }, [tiers]);

  const handlePurchase = (requestCount: number) => {
    setSelectedRequest(requestCount);
    openConfirmModal();
  };

  useEffect(() => {
    if (selectedRequest) {
      const { price, details } = calculateCumulativePrice(
        tiers,
        selectedRequest
      );
      setTotalPrice(+(price * quantity).toFixed(2));
      setPriceDetails(details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRequest, quantity]);

  useEffect(() => {
    if (inputRequestCount) {
      const { price, details } = calculateCumulativePrice(
        tiers,
        inputRequestCount
      );
      setTotalPrice(+(price * quantity).toFixed(2));
      setPriceDetails(details);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRequestCount, quantity, moreOptionsModalOpened]);

  const stripePayment = async () => {
    notifySuccess(`Purchasing ${selectedRequest! * quantity} requests!`);
    await sendPaymentRequest();
    closeConfirmModal();
  };

  const payPalPayment = async () => {
    notifySuccess(`Purchasing ${selectedRequest! * quantity} requests!`);
    await sendPaymentRequest("paypal-pay");
    closeConfirmModal();
  };

  const sendPaymentRequest = async (url = "stripe-pay") => {
    const requestPaymentRes = await requestPayment(
      subscription.proxyServiceId!,
      window.location.pathname,
      totalPrice.toString(),
      PAYMENT_TYPE.PAY_PER_REQUEST,
      selectedRequest! * quantity
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
    resetValues();
  };

  const resetValues = () => {
    setInputRequestCount(1000);
    setQuantity(1);
    setSelectedRequest(null);
  };

  return (
    <>
      <Card className="shadow-sm border-gray-200" withBorder>
        <Group className="mb-3 grid grid-cols-[1fr_auto]">
          <Title order={2}>Purchase More Requests</Title>
          <Button onClick={openMoreOptionsModal} variant="default">
            More Options
          </Button>
        </Group>
        <Text>Click a button below to purchase more requests:</Text>
        <Group className="button-group mt-4 grid grid-cols-2 gap-1 xl:grid-cols-6 md:grid-cols-3 sm:grid-cols-2">
          {precomputedPrices.map(({ increment, price, details }, index) => {
            const tier = tiers
              .filter((tier) => tier.price > 0)
              .find((tier) => increment >= tier.from && increment <= tier.to);
            return (
              <Tooltip key={index} label={details.join(" + ")}>
                <Button
                  key={index}
                  disabled={preview}
                  className="h-auto p-3"
                  variant="orange"
                  onClick={() => handlePurchase(increment)}
                >
                  <Box className="grid grid-rows-4 gap-y-2">
                    <Text className="font-bold">
                      <FixedFormatter value={increment} /> Req&apos;s
                    </Text>
                    <Text className="font-bold">at</Text>
                    <Text className="font-bold">
                      <CurrencyFormatter
                        price={price}
                        currencyType={subscription?.service?.currencyType}
                      />
                    </Text>
                    <Text className="font-bold text-xs">
                      ({tier?.pricePerRequest?.toFixed(4)} per request)
                    </Text>
                  </Box>
                </Button>
              </Tooltip>
            );
          })}
        </Group>
      </Card>

      <Modal
        centered
        opened={confirmModalOpened}
        onClose={() => {
          resetValues();
          closeConfirmModal();
        }}
        title="Confirm Purchase"
      >
        <Box>
          <Table>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Requests</Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <FixedFormatter value={selectedRequest! * quantity} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Total Price</Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <CurrencyFormatter
                    price={totalPrice}
                    currencyType={subscription?.service?.currencyType}
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Breakdown</Table.Td>
                <Table.Td className="float-end text-xs">
                  {priceDetails?.length > 1
                    ? SHOW_QUANTITY_INPUT
                      ? `(${priceDetails.join(" + ")}) * (${quantity})`
                      : `${priceDetails.join(" + ")}`
                    : SHOW_QUANTITY_INPUT
                    ? `${priceDetails.join(" + ")} * (${quantity})`
                    : `${priceDetails.join(" + ")}`}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Group className="flex justify-end mt-4">
            <Button
              onClick={() => {
                resetValues();
                closeConfirmModal();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            {payPalEnabled && !isFree && (
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
                  variant="default"
                  className="drop-shadow-md"
                >
                  <Image
                    component={NextImage}
                    src={stripeBtn}
                    w="auto"
                    h={30}
                    alt="Stripe Subscribe"
                  />
                </Button>
              )}
          </Group>
        </Box>
      </Modal>

      <Modal
        centered
        opened={moreOptionsModalOpened}
        onClose={() => {
          resetValues();
          closeMoreOptionsModal();
        }}
        title="More Options"
      >
        <Box>
          <NumberInput
            label={`Number of requests to purchase:`}
            className="mt-3"
            value={inputRequestCount}
            onChange={setInputRequestCount}
            thousandSeparator=","
            min={1}
            step={100}
            defaultValue={1000}
          />
          {SHOW_QUANTITY_INPUT && (
            <NumberInput
              label="Specify quantity:"
              thousandSeparator=","
              className="mt-3"
              value={quantity}
              onChange={(val) => setQuantity(+val || 1)}
              min={1}
            />
          )}
          <Table className="mt-3">
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>Requests</Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <FixedFormatter value={+inputRequestCount! * quantity} />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Total Price</Table.Td>
                <Table.Td style={{ textAlign: "right" }}>
                  <CurrencyFormatter
                    price={totalPrice}
                    currencyType={subscription?.service?.currencyType}
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Breakdown</Table.Td>
                <Table.Td className="float-end text-xs">
                  {priceDetails?.length > 1
                    ? SHOW_QUANTITY_INPUT
                      ? `(${priceDetails.join(" + ")})  * (${quantity})`
                      : `(${priceDetails.join(" + ")})`
                    : SHOW_QUANTITY_INPUT
                    ? `${priceDetails.join(" + ")} * (${quantity})`
                    : `${priceDetails.join(" + ")}`}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
          <Group className="flex justify-end mt-4">
            <Button
              onClick={() => {
                resetValues();
                closeMoreOptionsModal();
              }}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={preview}
              onClick={() => {
                handlePurchase(+inputRequestCount!);
                closeMoreOptionsModal();
              }}
              loading={loading === "stripe-payment"}
              type="button"
              variant="default"
              className="drop-shadow-md"
            >
              Purchase
            </Button>
          </Group>
        </Box>
      </Modal>
    </>
  );
}
