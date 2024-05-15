import { useEffect, useState } from "react";
import { Box, NumberInput, TextInput, Select, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { UseFormReturnType } from "@mantine/form";
// import { EndpointType } from "@/db/types/endpoint";
// import { checkEndpointWalletAddressExists } from "@/actions/endpoints";
// import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";
// import { sortObjectsByString } from "@/utils/sort";
import { ServiceType } from "@/db/types/service";
// import clsx from "clsx";

// const SN8_ONLY = true;
export function ServiceFormInput({
  form,
  //   validators,
  //   contracts,
  //   subnets,
  mode = "create",
}: //   onError,
//   hasSubs,
{
  form: UseFormReturnType<Partial<ServiceType>>;
  mode?: "create" | "update";
  //   contracts: Array<ContractType>;
  //   subnets?: Array<SubnetType>;
  //   validators?: Array<ValidatorType>;
  //   onError?: ({ error, reason }: { error: boolean; reason: string }) => void;
  //   hasSubs?: boolean;
}) {
  const [currencyType, setCurrencyType] = useState("");

  useEffect(() => {
    const isCryptoCurrencyType = form.getInputProps("currencyType").value;
    setCurrencyType(isCryptoCurrencyType);
    // if (isCryptoCurrencyType) delete values.walletAddress;
    // eslint-disable-next-line
  }, [form.getInputProps("currencyType").value]);

  const currencyTypes = [
    {
      value: "FIAT",
      label: "FIAT",
    },
    {
      value: "USDC",
      label: "USDC",
    },
    {
      value: "USDT",
      label: "USDT",
    },
  ];

  //   const { values } = form;

console.log(form.values);
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
        <Box mb="md">
          <Select
            label="Currency Type"
            withAsterisk
            value={form.values.currencyType || ""}
            placeholder="Choose a currency type"
            data={currencyTypes}
            {...form.getInputProps("currencyType")}
          />
        </Box>

        <Box mb="md">
          <TextInput
            withAsterisk
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

      <Group mb="md" grow>
        <Box mb="md">
          <NumberInput
            label="Request Limit"
            withAsterisk
            description="Determines the total numbers of requests."
            placeholder="10000"
            {...form.getInputProps("remaining")}
          />
        </Box>
        <Box mb="md">
          <NumberInput
            label="Limit"
            withAsterisk
            description="The total amount of burstable requests."
            placeholder="10"
            {...form.getInputProps("limit")}
          />
        </Box>
      </Group>
      <Box mb="md">
        <DateTimePicker
          label="Expiry Date"
          description="When should your keys expire?"
          withSeconds
          valueFormat="MM/DD/YYYY hh:mm:ss A"
          placeholder="Expiry Date"
          {...form.getInputProps("expires")}
        />
      </Box>

      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each interval"
            placeholder="1"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
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
