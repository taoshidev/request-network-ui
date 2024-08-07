"use client";

import { Box, Button, Group, Stepper, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { CreateValidator } from "./steps/CreateValidator";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { createValidatorEndpoint } from "@/actions/validators";
import { DatabaseResponseType } from "@/db/error";
import { NOTIFICATION_TYPE, useNotification } from "@/hooks/use-notification";
import EndpointForm from "./steps/EndpointForm";
import { pick as _pick } from "lodash";
import React from "react";
import ReviewValidatorEndpoint from "./steps/ReviewValidatorEndpoint";
import { Logo } from "../Logo";
import { fetchValidatorInfo } from "@/actions/bittensor/bittensor";
import { getSubnet } from "@/actions/subnets";
import { sendNotification } from "@/actions/notifications";
import { UserType } from "@/db/types/user";
import { SubnetType } from "@/db/types/subnet";
import { ContractType } from "@/db/types/contract";
import clsx from "clsx";
import { useOrientation } from "@/hooks/use-orientation";
import AgreeTOSModal from "../AgreeTOSModal";
import { useModals } from "@mantine/modals";
import { randomBytes } from "crypto";

type KeyType = { apiKey: string; apiSecret: string };
const STEP_COUNT = 3;

export default function ValidatorStepper({
  user,
  subnets,
  contracts,
}: {
  user: UserType;
  subnets: SubnetType[];
  contracts: ContractType[];
}) {
  const stepInputs = [
    ["name", "description", "hotkey", "baseApiUrl"],
    ["url", "contractId", "walletAddress"],
  ];
  const [direction, setDirection] = useState<"left" | "right">("left");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });
  const [walletExists, setWalletExists] = useState<boolean>(false);
  const [keyModalOpened, setKeyModalOpened] = useState(false);
  const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);
  const [hotkeyExists, setHotkeyExists] = useState<boolean>(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const form = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      agreedToTOS: false,
      name: "",
      description: "",
      hotkey: "",
      userId: user?.id || "",
      verified: false,
      enabled: false,
      walletAddress: "",
      subnetId: "",
      baseApiUrl: "",
      url: "",
      percentRealtime: "",
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const [active, setActive] = useState(0);
  const orientation = useOrientation(700);
  const modals = useModals();

  const agreeModalRef = useRef<string | null>(null);

  const openAgreeModal = () => {
    agreeModalRef.current = modals.openModal({
      modalId: agreeModalRef.current!,
      centered: true,
      size: "xl",
      title: "Terms of Service Agreement",
      children: <AgreeTOSModal user={user} modalRef={agreeModalRef} />,
    });
  };

  useEffect(() => {
    if (!user.user_metadata?.agreed_to_tos && !agreeModalRef?.current) {
      agreeModalRef.current = `rn-modal-${randomBytes(10).toString("hex")}`;
      setTimeout(() => openAgreeModal(), 1000);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getErrors = () => {
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
  };

  const valid = () => {
    const currentErrors = getErrors();
    return stepInputs.reduce((prev, curr, index) => {
      let error = false;
      for (let key of Object.keys(currentErrors)) {
        if (curr.includes(key)) error = true;
      }
      prev.push(!error as any);
      return prev;
    }, []);
  };

  const setStep = (step: number) => {
    if ((step === 0 || valid()[step - 1]) && step !== active) {
      setDirection(step > active ? "right" : "left");
      setTimeout(() => setActive(step), 0);
    }
  };

  const nextStep = () => {
    if (active === 0) {
      if (!user?.user_metadata?.agreed_to_tos) {
        openAgreeModal();
        return;
      }

      form.setValues({ agreedToTOS: true });
    }

    if (valid()[active] && !hotkeyExists) {
      setDirection("right");
      setActive((current) => (current < 3 ? current + 1 : current));
    } else {
      form.setErrors(_pick(getErrors(), stepInputs[active]));
    }
  };

  const prevStep = () => {
    getErrors();
    setDirection("left");
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  useEffect(() => {
    setDirection(direction === "left" ? "right" : "left");
  }, [active]);

  const handleRegistrationComplete = ({ apiKey, apiSecret }: KeyType) => {
    setKeys({ apiKey, apiSecret });
    setKeyModalOpened(true);
  };

  const onSubmit = async (values: Partial<ValidatorType & EndpointType>) => {
    setLoading(true);
    const subnetId = values.subnetId as string;
    const subnet = await getSubnet({ id: subnetId });
    const { netUid } = subnet;
    const neuronInfo = await fetchValidatorInfo(
      netUid as number,
      form?.values?.hotkey as string
    );
    if (!neuronInfo) {
      if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
        notifyError(
          `Cannot find validator neuron info with hotkey: ${form?.values?.hotkey} on mainnet in subnet: ${netUid}. Please check validity of your hotkey in previous step.`
        );
        setLoading(false);
        return;
      }
      notifyInfo(
        `Cannot find validator neuron info with hotkey: ${form?.values?.hotkey} on testnet. Some features may not work correctly.`
      );
    }

    const bittensorUid = neuronInfo?.uid || 0;
    const bittensorNetUid = neuronInfo?.netuid || 0;

    const {
      name,
      description,
      userId,
      hotkey,
      baseApiUrl,
      agreedToTOS,
      walletAddress,
      ...endpoint
    } = values;
    const validator: ValidatorType = {
      name,
      description,
      userId,
      hotkey,
      baseApiUrl,
      walletAddress,
      agreedToTOS: agreedToTOS as boolean,
    };

    if (bittensorUid) {
      Object.assign(validator, { bittensorUid });
    }

    if (bittensorNetUid) {
      Object.assign(validator, { bittensorNetUid });
    }

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
      setActive(STEP_COUNT);

      sendNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        subject: `Validator "${validator.name}" Registered Successfully!`,
        content: `You have successfully created validator "${validator.name}".`,
        fromUserId: user?.id,
        userNotifications: [user],
      });
    } catch (error: Error | unknown) {
      setLoading(false);
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
        onCopy={(key: keyType) =>
          setKeys((prev) => ({ ...prev, [key]: prev[key] }))
        }
        title="API Access Key"
      />

      <Box
        component="form"
        className="w-full"
        onSubmit={form.onSubmit(onSubmit)}
      >
        <Stepper
          active={active}
          onStepClick={(step) => setStep(step)}
          orientation={orientation}
        >
          <Stepper.Step
            label="Create Validator"
            description="Validator information"
          >
            <Box className={clsx("slide", direction)}>
              <CreateValidator
                form={form}
                user={user}
                hotkeyExists={hotkeyExists}
                onHotkeyExists={setHotkeyExists}
              />
            </Box>
          </Stepper.Step>
          <Stepper.Step
            label="Create Endpoint"
            description="Endpoint information"
          >
            <Box className={clsx("slide", direction)}>
              <EndpointForm
                form={form}
                subnets={subnets}
                contracts={contracts}
                onError={(event) => {
                  setWalletExists(event.error);
                }}
              />
            </Box>
          </Stepper.Step>
          <Stepper.Step label="Review" description="Review Information">
            <Box className={clsx("slide", direction)}>
              <ReviewValidatorEndpoint
                form={form}
                contracts={contracts}
                errors={errors}
              />
            </Box>
          </Stepper.Step>
          <Stepper.Completed>
            <Box className={clsx("py-10 slide", direction)}>
              <Title order={2} className="text-center">
                Validator and Endpoint Saved Successfully
              </Title>
              <Box className="mt-10">
                <Logo size={200} />
              </Box>
            </Box>
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          {active < STEP_COUNT && (
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active < 1 || loading}
            >
              Back
            </Button>
          )}
          {active < STEP_COUNT - 1 && (
            <Button
              disabled={
                hotkeyExists || (active === 1 && walletExists) || loading
              }
              onClick={nextStep}
            >
              Next step
            </Button>
          )}
          {active === STEP_COUNT - 1 && (
            <Button
              type="submit"
              loading={loading}
              disabled={hotkeyExists || walletExists}
            >
              Register
            </Button>
          )}
        </Group>
      </Box>
    </>
  );
}
