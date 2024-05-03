import { useEffect, useState } from "react";
import { Box, NumberInput, TextInput, Select, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { UseFormReturnType } from "@mantine/form";
import { EndpointType } from "@/db/types/endpoint";
import clsx from "clsx";

export function EndpointFormInput({
  form,
  validators,
  subnets,
  mode = "create",
}: {
  form: UseFormReturnType<Partial<ValidatorType & EndpointType>>;
  mode?: "create" | "update";
  subnets?: Array<SubnetType>;
  validators?: Array<ValidatorType>;
}) {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [animate, setAnimate] = useState(mode === "create");

  useEffect(() => {
    const isCryptoCurrencyType =
      form.getInputProps("currencyType").value === "Crypto";
    setShowPriceInput(isCryptoCurrencyType);
    // eslint-disable-next-line
  }, [form.getInputProps("currencyType").value]);

  const verifiedValidators = validators
    ? (validators || [])
        .filter((v) => v.verified)
        .map((v) => ({
          value: v.id as string,
          label: v?.name || v?.account?.meta?.name || "Unknown",
        }))
    : [];

  const availableSubnets = (subnets || []).map((s) => ({
    value: s.id!,
    label: s.label!,
  }));

  // Fiat currency types, validator will need to self manage
  const currencyTypes = [
    {
      value: "Fiat",
      label: "Fiat",
    },
    {
      value: "Crypto",
      label: "Crypto",
    },
  ];

  return (
    <>
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Endpoint Path"
          placeholder="/api/v1/data-endpoint-path"
          {...form.getInputProps("url")}
        />
      </Box>
      {mode === "create" && validators && (
        <Box mb="md">
          <Select
            withAsterisk
            label="Which Validator"
            placeholder="Pick value or enter anything"
            data={verifiedValidators}
            {...form.getInputProps("validator")}
          />
        </Box>
      )}
      {mode === "create" && (
        <>
          <Box mb="md">
            <Select
              label="Which Subnet"
              withAsterisk
              placeholder="Pick value or enter anything"
              data={availableSubnets}
              {...form.getInputProps("subnet")}
            />
          </Box>
          <Box mb="md">
            <Select
              label="Currency Type"
              withAsterisk
              placeholder="Choose a currency type"
              data={currencyTypes}
              {...form.getInputProps("currencyType")}
            />
          </Box>
        </>
      )}
      {showPriceInput && (
        <Box mb="md">
          <TextInput
            className={clsx(animate && "animate-slide-down")}
            label="Price"
            description="Price in USDC/USDT"
            placeholder="5"
            {...form.getInputProps("price")}
          />
        </Box>
      )}
      <Box mb="md">
        <DateTimePicker
          label="Expiry Date"
          description="When should your keys expire?"
          withSeconds
          placeholder="Pick date"
          {...form.getInputProps("expires")}
        />
      </Box>
      <Box mb="md">
        <NumberInput
          label="Limit"
          withAsterisk
          description="The total amount of burstable requests."
          placeholder="Input placeholder"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each refillInterval"
            placeholder="Input placeholder"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="Input placeholder"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
