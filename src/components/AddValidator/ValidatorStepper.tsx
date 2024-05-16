"use client";

import { Box, Button, Group, Stepper, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import { CreateValidator } from "./steps/CreateValidator";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { createValidatorEndpoint } from "@/actions/validators";
import { DatabaseResponseType } from "@/db/error";
import { useNotification } from "@/hooks/use-notification";
import EndpointForm from "./steps/EndpointForm";
import { isEmpty as isEmpty, pick as _pick } from "lodash";
import { DateTime } from "luxon";
import { TextEditor } from "../TextEditor";
import React from "react";
import ReviewValidatorEndpoint from "./steps/ReviewValidatorEndpoint";

type KeyType = { apiKey: string; apiSecret: string };

export default function ValidatorStepper({
  user,
  subnets,
  contracts,
  expires,
}) {
  const stepInputs = [
    ["name", "description", "hotkey", "baseApiUrl"],
    ["url", "contractId", "walletAddress"],
  ];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });
  const [walletExists, setWalletExists] = useState<boolean>(false);
  const [keyModalOpened, setKeyModalOpened] = useState(false);
  const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);
  const [hotkeyExists, setHotkeyExists] = useState<boolean>(false);
  const { notifySuccess, notifyError } = useNotification();
  const form = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      name: "",
      description: "",
      userId: user?.id || "",
      verified: false,
      enabled: false,
      walletAddress: "",
      subnetId: "",
      baseApiUrl: "",
      url: "",
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const [active, setActive] = useState(0);

  function getErrors() {
    const nextErrors =
      ValidatorEndpointSchema.safeParse(form.values)?.["error"]?.issues?.reduce(
        (prev, curr) => {
          prev[curr.path[0]] = curr.message;
          return prev;
        },
        {}
      ) || {};
    setErrors(nextErrors);
    return nextErrors;
  }

  function valid() {
    const currentErrors = getErrors();
    return stepInputs.reduce((prev, curr, index) => {
      let error = false;
      for (let key of Object.keys(currentErrors)) {
        if (curr.includes(key)) error = true;
      }
      prev.push(!error as any);
      return prev;
    }, []);
  }

  const setStep = (step) => {
    if (step === 0 || valid()[step - 1]) setActive(step);
  };

  const nextStep = () => {
    if (valid()[active])
      setActive((current) => (current < 3 ? current + 1 : current));
    else form.setErrors(_pick(getErrors(), stepInputs[active]));
  };
  const prevStep = () => {
    getErrors();
    setActive((current) => (current > 0 ? current - 1 : current));
  };

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
      const { apiId: apiKey = "", apiSecret = "" } = newValidator;
      handleRegistrationComplete({
        apiKey: apiKey as string,
        apiSecret: apiSecret as string,
      });

      notifySuccess("Validator registered successfully");
      setActive((current) => 3);
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
        onSubmit={form.onSubmit(onSubmit)}
      >
        <Stepper active={active} onStepClick={setStep}>
          <Stepper.Step
            label="Create Validator"
            description="Validator information"
          >
            <CreateValidator
              form={form}
              subnets={subnets}
              onComplete={handleRegistrationComplete}
              hotkeyExists={hotkeyExists}
              setHotkeyExists={setHotkeyExists}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Create Endpoint"
            description="Endpoint information"
          >
            <EndpointForm
              form={form}
              subnets={subnets}
              contracts={contracts}
              onError={(event) => {
                setWalletExists(event.error);
              }}
            />
          </Stepper.Step>
          <Stepper.Step>
            <ReviewValidatorEndpoint
              form={form}
              contracts={contracts}
              errors={errors}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Title order={2} className="text-center py-20">
              Validator and Endpoint Saved Successfully
            </Title>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          {active < 3 && (
            <Button variant="default" onClick={prevStep} disabled={active < 1}>
              Back
            </Button>
          )}
          {active < 2 && (
            <Button onClick={nextStep} disabled={active > 1}>
              Next step
            </Button>
          )}
          {active === 2 && (
            <Button
              type="submit"
              loading={loading}
              disabled={hotkeyExists || walletExists}
            >
              Create
            </Button>
          )}
        </Group>
      </Box>
    </>
  );
}
