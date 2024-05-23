import { useEffect, useState } from "react";
import {
  Box,
  Text,
  TextInput,
  Select,
  CopyButton,
  Button,
} from "@mantine/core";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { UseFormReturnType } from "@mantine/form";
import { EndpointType } from "@/db/types/endpoint";
import { checkPropExists } from "@/actions/validators";
import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";

import clsx from "clsx";
import { IconCopy } from "@tabler/icons-react";
import { isCrypto } from "@/utils/is-crypto";

const SN8_ONLY = true;
export default function EndpointForm({
  form,
  validators,
  contracts,
  subnets,
  mode = "create",
  onError,
  hasSubs,
}: {
  form: UseFormReturnType<Partial<ValidatorType & EndpointType>>;
  mode?: "create" | "update";
  contracts: Array<ContractType>;
  subnets?: Array<SubnetType>;
  validators?: Array<ValidatorType>;
  onError?: ({ error, reason }: { error: boolean; reason: string }) => void;
  hasSubs?: boolean;
}) {
  const [isCryptoType, setIsCryptoType] = useState(false);
  const [addressExists, setAddressExists] = useState<boolean>(false);
  const { notifyError } = useNotification();

  useEffect(() => {
    const contract = contracts.find(
      (contract) => contract.id === form.values.contractId
    );
    const isCryptoCurrencyType = isCrypto(contract?.services);
    setIsCryptoType(isCryptoCurrencyType);
    if (!isCryptoCurrencyType) delete values.walletAddress;
    // eslint-disable-next-line
  }, [form.getInputProps("contractId").value]);

  const verifiedValidators = validators
    ? (validators || [])
        .filter((v) => v.verified)
        .map((v) => ({
          value: v?.id as string,
          label: v?.name || v?.account?.meta?.name || "Unknown",
        }))
    : [];

  const availableSubnets = (subnets || [])?.map((s) => ({
    value: s.id!,
    label: s.label!,
    disabled: SN8_ONLY && s.netUid !== 8,
  }));

  const availableContracts = (contracts ? contracts : []).map((c) => ({
    value: c.id,
    label: c.title,
    disabled: !c.active,
  }));

  const sortedSubnets = availableSubnets.sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  const { values } = form;

  const handleOnBlurWalletAddress = async (evt) => {
    const walletAddress = values.walletAddress;
    if (walletAddress) {
      try {
        const exists = await checkPropExists({walletAddress});

        if (exists) {
          notifyError(
            "ERC-20 wallet address already in use by another validator."
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
    <Box className={clsx(mode === "create" ? "pt-8" : "")}>
      {mode !== "create" && form.values?.walletAddress?.length > 0 && (
        <Box className="mb-4">
          <Text className="text-sm text-left">Wallet Address</Text>
          <CopyButton value={form.values?.walletAddress}>
            {({ copied, copy }) => (
              <Button
                className="flex w-full"
                rightSection={<IconCopy size={14} />}
                variant="subtle"
                onClick={() => {
                  copy();
                }}
              >
                <Text fw="bold">
                  {copied
                    ? `Copied wallet address`
                    : form.values?.walletAddress}
                </Text>
              </Button>
            )}
          </CopyButton>
        </Box>
      )}
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
      <Box mb="md">
        <Select
          label="Contract"
          withAsterisk
          placeholder="Choose a contract"
          clearable
          data={availableContracts}
          {...form.getInputProps("contractId")}
          disabled={hasSubs}
        />
      </Box>
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
          {isCryptoType && (
            <Box mb="md">
              <TextInput
                className={clsx(
                  isCryptoType &&
                    !form.getInputProps("walletAddress")?.value &&
                    "animate-slide-down"
                )}
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
                  Wallet address is already in use by another validator.
                </p>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
