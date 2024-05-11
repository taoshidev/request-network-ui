import { useEffect, useState } from "react";
import { Box, NumberInput, TextInput, Select, Group } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { UseFormReturnType } from "@mantine/form";
import { EndpointType } from "@/db/types/endpoint";
import { checkEndpointWalletAddressExists } from "@/actions/endpoints";
import { useNotification } from "@/hooks/use-notification";
import clsx from "clsx";

const SN8_ONLY = true;
export function EndpointFormInput({
  form,
  validators,
  subnets,
  mode = "create",
  onError,
  hasSubs
}: {
  form: UseFormReturnType<Partial<ValidatorType & EndpointType>>;
  mode?: "create" | "update";
  subnets?: Array<SubnetType>;
  validators?: Array<ValidatorType>;
  onError?: ({ error, reason }: { error: boolean; reason: string }) => void;
  hasSubs?: boolean
}) {
  const [isCryptoType, setIsCryptoType] = useState(false);
  const [addressExists, setAddressExists] = useState<boolean>(false);
  const { notifyError } = useNotification();

  useEffect(() => {
    const isCryptoCurrencyType =
      form.getInputProps("currencyType").value === "Crypto";
    setIsCryptoType(isCryptoCurrencyType);
    if (isCryptoCurrencyType) delete values.walletAddress;
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
    disabled: SN8_ONLY && s.netUid !== 8,
  }));

  const sortedSubnets = availableSubnets.sort((a, b) => a.label.localeCompare(b.label));

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

  const { values } = form;

  const handleOnBlurWalletAddress = async (evt) => {
    const walletAddress = values.walletAddress;
    if (walletAddress) {
      try {
        const exists = await checkEndpointWalletAddressExists(walletAddress);
        if (exists) {
          notifyError(
            "ERC-20 wallet address already in use by another endpoint."
          );
          setAddressExists(exists as boolean);
          onError?.({ error: true, reason: "Wallet address exists" });
        }
      } catch (error: Error | unknown) {
        throw new Error((error as Error)?.message);
      }
    }
  };

  const handleOnChangeWalletAddress = () => {
    setAddressExists(false);
    onError?.({ error: false, reason: "Reset on edit" });
  };

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
            placeholder="Choose a validator"
            data={verifiedValidators}
            {...form.getInputProps("validatorId")}
          />
        </Box>
      )}
      {mode === "create" && (
        <>
          <Box mb="md">
            <Select
              label="Which Subnet"
              withAsterisk
              placeholder="Choose a subnet"
              clearable
              data={sortedSubnets}
              {...form.getInputProps("subnetId")}
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
          {isCryptoType && (
            <Box mb="md">
              <TextInput
                className={clsx(isCryptoType && "animate-slide-down")}
                label="ERC-20 wallet address"
                withAsterisk={isCryptoType}
                placeholder="Enter ERC-20 wallet address"
                {...form.getInputProps("walletAddress")}
                onBlur={(event) => {
                  form.getInputProps("walletAddress").onBlur(event);
                  handleOnBlurWalletAddress(event);
                }}
                onChange={(event) => {
                  form.getInputProps("walletAddress").onChange(event);
                  handleOnChangeWalletAddress();
                }}
              />
              {addressExists && (
                <p className="pt-1 text-xs text-[#fa5252] mantine-TextInput-error">
                  Wallet address is already in use by another endpoint.
                </p>
              )}
            </Box>
          )}
        </>
      )}
      <Box mb="md">
        <TextInput
          label="Price"
          description={
            "Price in" + (isCryptoType ? " USDC/USDT" : "Price in USD")
          }
          placeholder="5"
          {...form.getInputProps("price")}
          disabled={hasSubs}
        />
      </Box>
      <Box mb="md">
        <DateTimePicker
          label="Expiry Date"
          description="When should your keys expire?"
          withSeconds
          placeholder="Expiry Date"
          {...form.getInputProps("expires")}
        />
      </Box>
      <Box mb="md">
        <NumberInput
          label="Limit"
          withAsterisk
          description="The total amount of burstable requests."
          placeholder="Limit"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            withAsterisk
            description="How many tokens to refill during each refillInterval"
            placeholder="Refill Rate"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            withAsterisk
            description="Determines the speed at which tokens are refilled."
            placeholder="Refill Interval"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>
    </>
  );
}
