"use client";

import { Box, Button, Group, Stepper } from "@mantine/core";
import { useState } from "react";
import { CreateValidator } from "./steps/CreateValidator";
import { Limits } from "./steps/Limits";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { EndpointFormInput } from "../EndpointFormInput";
import { createValidatorEndpoint } from "@/actions/validators";
import { DatabaseResponseType } from "@/db/error";
import { useNotification } from "@/hooks/use-notification";

type KeyType = { apiKey: string; apiSecret: string };

export default function ValidatorStepper({ user, subnets, validators, contracts, expires }) {
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });
  const [walletExists, setWalletExists] = useState<boolean>(false);
  const [keyModalOpened, setKeyModalOpened] = useState(false);
  const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);
  const [hotkeyExists, setHotkeyExists] = useState<boolean>(false);
  const { notifySuccess, notifyError } = useNotification();
  const validatorForm = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      name: "",
      description: "",
      userId: user?.id || "",
      verified: false,
      enabled: false,
      currencyType: "Crypto",
      walletAddress: "",
      price: "",
      hotkey: "",
      subnetId: "",
      limit: 10,
      baseApiUrl: "",
      url: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
      terms: "1",
      expires,
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const endpointForm = useForm<Partial<EndpointType>>({
    name: "create-new-endpoint",
    initialValues: {
      limit: 10,
      url: "",
      subnetId: "",
      validatorId: "",
      currencyType: "Crypto",
      walletAddress: "",
      price: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
    },
    validate: zodResolver(
      EndpointSchema.omit({
        active: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      })
    ),
  });

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleRegistrationComplete = ({ apiKey, apiSecret }: KeyType) => {
    setKeys({ apiKey, apiSecret });
    setKeyModalOpened(true);
    // send validator created email
  };

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
      const { apiId: apiKey = '', apiSecret = '' } = newValidator;
      handleRegistrationComplete({ apiKey, apiSecret });

      notifySuccess("Validator registered successfully");
    } catch (error: Error | unknown) {
      notifyError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={keyModalOpened}
        onClose={() => setKeyModalOpened(false)}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="API Access Key"
      />

      <Box
        component="form"
        className="w-full"
        onSubmit={validatorForm.onSubmit(onSubmit)}
      >
        <Stepper active={active} onStepClick={setActive}>
          <Stepper.Step label="Validator 1" description="Create validator">
            <CreateValidator
              form={validatorForm}
              subnets={subnets}
              onComplete={handleRegistrationComplete}
              hotkeyExists={hotkeyExists}
              setHotkeyExists={setHotkeyExists}
            />
          </Stepper.Step>
          <Stepper.Step label="Validator 2" description="Validator details">
            <EndpointFormInput
              form={validatorForm}
              subnets={subnets}
              contracts={contracts}
              onError={(event) => {
                setWalletExists(event.error);
              }}
            />
          </Stepper.Step>
          <Stepper.Step label="Create Endpoint" description="Create Endpoint">
            <Limits
              validators={validators}
              subnets={subnets}
              onComplete={() => {}}
              contracts={contracts}
              form={endpointForm}
            />
          </Stepper.Step>
          <Stepper.Completed>
            Completed, click back button to get to previous step
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep}>Next step</Button>
          <Button
            type="submit"
            loading={loading}
            disabled={hotkeyExists || walletExists}
          >
            Create
          </Button>
        </Group>
      </Box>
    </>
  );
}
