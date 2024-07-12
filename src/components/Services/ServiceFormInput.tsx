import { useEffect, useState, Dispatch, SetStateAction } from "react";
import {
  Box,
  NumberInput,
  TextInput,
  Select,
  Group,
  Text,
  Button,
  ActionIcon,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { ServiceType } from "@/db/types/service";
import { getAuthUser } from "@/actions/auth";
import { UserType } from "@/db/types/user";
import { useRouter } from "next/navigation";
import { IconPlus, IconX } from "@tabler/icons-react";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import { TierType } from "@/components/Services/ServiceForm";

export function ServiceFormInput({
  form,
  tiers,
  setTiers,
}: {
  form: UseFormReturnType<Partial<ServiceType>>;
  tiers: TierType[];
  setTiers: Dispatch<SetStateAction<TierType[]>>;
}) {
  const [currencyType, setCurrencyType] = useState("");
  const [user, setUser] = useState<UserType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getAuthUser();
      if (!user) {
        router.push("/login");
      }
      setUser(user);
    };
    fetchUser();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const isCryptoCurrencyType = form.getInputProps("currencyType").value;
    setCurrencyType(isCryptoCurrencyType);
    // eslint-disable-next-line
  }, [form.getInputProps("currencyType").value]);

  const currencyTypes = [
    {
      value: "FIAT",
      label: "FIAT",
      disabled: !user?.user_metadata?.stripe_enabled,
    },
    {
      value: "USDC",
      label: "USDC",
      disabled: !user?.user_metadata?.crypto_enabled,
    },
    {
      value: "USDT",
      label: "USDT",
      disabled: !user?.user_metadata?.crypto_enabled,
    },
  ];

  const paymentType = [
    {
      value: PAYMENT_TYPE.FREE,
      label: "Free",
    },
    {
      value: PAYMENT_TYPE.SUBSCRIPTION,
      label: "Subscription",
    },
    {
      value: PAYMENT_TYPE.PAY_PER_REQUEST,
      label: "Pay Per Request",
    },
  ];

  const handlePaymentTypeChange = (paymentType: string | null) => {
    if (paymentType === "FREE") {
      form.setFieldValue("price", "0.00");
    } else if (paymentType === PAYMENT_TYPE.PAY_PER_REQUEST) {
      form.setFieldValue("price", "0.00");
      const freeTier = tiers?.find((tier) => +tier.price === 0);

      if (freeTier) {
        form.setFieldValue("remaining", freeTier.to);
      }
    }
    form.setFieldValue("paymentType", paymentType);
  };

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    setTiers([
      ...tiers,
      {
        from: lastTier.to + 1,
        to: lastTier.to + 1000,
        price: 0.0,
        pricePerRequest: 0.0000,
      },
    ]);
  };

  const updateTier = (index: number, field: string, value: string | number) => {
    if (isNaN(+value)) return;
    const updatedTiers = [...tiers];
    updatedTiers[index][field] = value;

    if (field === "to" && index < updatedTiers.length - 1) {
      updatedTiers[index + 1].from = +value + 1;
    }

    if (field === "price") {
      const prevIndex = index > 0 ? index - 1 : -1;
      const prevTier = prevIndex !== -1 ? updatedTiers[prevIndex] : null;
      const price = prevIndex === -1 ? +value : +value - +prevTier?.price!;

      updatedTiers[index].pricePerRequest = parseFloat(
        (
          price /
          (+updatedTiers[index].to - (+updatedTiers[index].from - 1))
        ).toFixed(4)
      );
    }

    let cumulativePrice = 0;
    updatedTiers.forEach((tier, i) => {
      let tierRange = tier.to - (tier.from - 1);
      cumulativePrice += tierRange * tier.pricePerRequest;
      if (!(i === index && field === "price")) {
        tier.price = parseFloat(cumulativePrice.toFixed(2));
      }
    });

    setTiers(updatedTiers);
  };

  const removeTier = (index: number) => {
    const updatedTiers = [...tiers];
    updatedTiers.splice(index, 1);
    setTiers(updatedTiers);
  };

  return (
    <>
      <Box mb="md">
        <TextInput
          label="Service Name"
          withAsterisk
          placeholder="Service Name"
          {...form.getInputProps("name")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <Select
            label="Currency Type"
            withAsterisk
            value={form.values.currencyType || ""}
            placeholder="Choose a currency type"
            data={currencyTypes}
            {...form.getInputProps("currencyType")}
          />
        </Box>
      </Group>
      <Group grow>
        <Box>
          <Select
            label="Payment Type"
            withAsterisk
            value={form.values.paymentType || ""}
            placeholder="Select payment type"
            data={paymentType}
            {...form.getInputProps("paymentType")}
            onChange={(value) => handlePaymentTypeChange(value)}
          />
        </Box>
      </Group>
      <Group mt="md" grow>
        {form.values.paymentType === PAYMENT_TYPE.PAY_PER_REQUEST && (
          <Box>
            <Box className="grid grid-cols-[1fr_auto] gap-4">
              <Text mb="lg">Tiers</Text>
              <Button leftSection={<IconPlus />} onClick={addTier}>
                Add Tier
              </Button>
            </Box>
            {tiers.map((tier, index, arr) => (
              <Group
                key={index}
                mb="sm"
                className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2"
              >
                <NumberInput
                  label="From"
                  min={
                    index > 0 && arr[index - 1].to ? arr[index - 1].to + 1 : 1
                  }
                  disabled={index === 0}
                  thousandSeparator=","
                  value={tier.from}
                  onChange={(value) => updateTier(index, "from", value!)}
                />
                <NumberInput
                  label="To"
                  min={tier.from || 100}
                  thousandSeparator=","
                  step={1000}
                  value={tier.to}
                  onChange={(value) => updateTier(index, "to", value!)}
                />
                <NumberInput
                  label="Price Per Request"
                  thousandSeparator=","
                  min={0}
                  value={tier.pricePerRequest}
                  step={0.0001}
                  onChange={(value) =>
                    updateTier(index, "pricePerRequest", value!)
                  }
                />
                <TextInput
                  label="Tier Price"
                  value={tier.price}
                  onChange={(event) =>
                    updateTier(index, "price", event.currentTarget.value!)
                  }
                />
                <ActionIcon
                  className="mt-6 float-end h-9 w-9"
                  variant="outline"
                  color="red"
                  disabled={tiers.length === 1}
                  onClick={() => removeTier(index)}
                >
                  <IconX />
                </ActionIcon>
              </Group>
            ))}
          </Box>
        )}
      </Group>
      {form.values.paymentType === "SUBSCRIPTION" && (
        <Group mb="md" grow>
          <Box>
            <TextInput
              withAsterisk
              description="Set price for service. For FREE payment type, set price to 0."
              label={
                "Price in " +
                (currencyType === "USDC" || currencyType === "USDT"
                  ? currencyType
                  : "USD")
              }
              placeholder="5"
              {...form.getInputProps("price")}
            />
          </Box>
        </Group>
      )}
      {form.values.paymentType !== PAYMENT_TYPE.PAY_PER_REQUEST && (
        <Group mb="md" grow>
          <Box>
            <NumberInput
              label="Request Limit"
              thousandSeparator=","
              withAsterisk
              description="Determines the total numbers of requests."
              placeholder="10000"
              {...form.getInputProps("remaining")}
            />
          </Box>
          {form.values.paymentType !== PAYMENT_TYPE.SUBSCRIPTION && (
            <Box>
              <DateTimePicker
                label="Expiry Date"
                description="When should your keys expire?"
                withSeconds
                valueFormat="MM/DD/YYYY hh:mm:ss A"
                placeholder="Expiry Date"
                {...form.getInputProps("expires")}
              />
            </Box>
          )}
        </Group>
      )}

      <Box mb="md">
        <NumberInput
          label="Limit"
          thousandSeparator=","
          withAsterisk
          description="The total amount of burstable requests."
          placeholder="10"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Interval"
            thousandSeparator=","
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="1000"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
