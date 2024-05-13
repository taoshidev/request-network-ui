"use client";

import { useState } from "react";
import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointFormInput } from "@components/EndpointFormInput";
import {
  createValidatorEndpoint,
  checkHotkeyExists,
} from "@/actions/validators";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { useNotification } from "@/hooks/use-notification";
import { DatabaseResponseType } from "@/db/error";
import { UserType } from "@/db/types/user";
import { SubnetType } from "@/db/types/subnet";
import { ContractType } from "@/db/types/contract";
import { KeyType } from "@/components/Validators/Validators";
import { TextEditor } from "@/components/TextEditor";

const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);

export function CreateValidator({
  onComplete,
  user,
  subnets,
  contracts,
}: {
  user: UserType;
  subnets: SubnetType[];
  contracts: ContractType[];
  onComplete: ({ apiKey, apiSecret }: KeyType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [hotkeyExists, setHotkeyExists] = useState<boolean>(false);
  const [walletExists, setWalletExists] = useState<boolean>(false);
  const { notifySuccess, notifyError } = useNotification();

  const form = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      name: "",
      description: "",
      userId: user?.id || "",
      verified: false,
      enabled: false,
      currencyType: "Crypto",
      walletAddress: "",
      termsOfService: "",
      price: "",
      hotkey: "",
      subnetId: "",
      contractId: "",
      limit: 10,
      baseApiUrl: "",
      url: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
      expires: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const onSubmit = async (values: Partial<ValidatorType & EndpointType>) => {
    setLoading(true);

    const { name, description, userId, hotkey, baseApiUrl, ...endpoint } =
      values;
    const validator = { name, description, userId, hotkey, baseApiUrl };
    try {
      const res = await createValidatorEndpoint(validator, endpoint);

      if ((res as DatabaseResponseType)?.error)
        throw new Error((res as DatabaseResponseType)?.message);
      const { validator: newValidator } = res as {
        validator: ValidatorType;
      };
      const { apiId: apiKey = "", apiSecret = "" } = newValidator;
      onComplete({ apiKey, apiSecret } as KeyType);

      notifySuccess("Validator registered successfully");
    } catch (error: Error | unknown) {
      notifyError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const { values } = form;

  const handleOnBlurHotkey = async (evt) => {
    const hotkey = values.hotkey;
    if (hotkey) {
      try {
        const exists = await checkHotkeyExists(hotkey);
        if (exists) {
          notifyError("Hotkey already in use by another validator.");
          setHotkeyExists(exists as boolean);
        }
      } catch (error: Error | unknown) {
        throw new Error((error as Error)?.message);
      }
    }
  };

  return (
    <>
      <Box
        component="form"
        className="w-full"
        onSubmit={form.onSubmit(onSubmit)}
      >
        <TextInput
          mb="md"
          withAsterisk
          label="Validator Name"
          placeholder="Enter a name for your validator"
          {...form.getInputProps("name")}
        />
        <TextEditor<ValidatorType>
          type="BubbleEditor"
          prop="description"
          form={form}
          label={{ text: "Description (Rich text format)", required: true }}
          // onChange={handleEditorChange}
        />
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Hotkey"
            placeholder="Hotkey"
            {...form.getInputProps("hotkey")}
            onBlur={(event) => {
              form.getInputProps("hotkey").onBlur(event);
              handleOnBlurHotkey(event);
            }}
            onChange={(event) => {
              form.getInputProps("hotkey").onChange(event);
              setHotkeyExists(false);
            }}
          />
          {hotkeyExists && (
            <p className="pt-1 text-xs text-[#fa5252] mantine-TextInput-error">
              Hotkey already in use by another validator.
            </p>
          )}
        </Box>
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Request Network API Url"
            placeholder="https://example.com:8080"
            {...form.getInputProps("baseApiUrl")}
          />
        </Box>
        <EndpointFormInput
          form={form}
          subnets={subnets}
          contracts={contracts}
          onError={(event) => {
            setWalletExists(event.error);
          }}
        />
        <Box>
          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={hotkeyExists || walletExists}
          >
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
}
