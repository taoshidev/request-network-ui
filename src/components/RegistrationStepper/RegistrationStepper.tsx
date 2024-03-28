"use client";

import { useState, useEffect } from "react";
import { Stepper, Button, Group, Text, Box, Title } from "@mantine/core";
import {
  useRegistration,
  RegistrationData,
} from "@/providers/registration-provider";
import { createKey } from "@/actions/keys";
import { generateShortId } from "@/utils/ids";
import { SubscriptionType, createSubscription } from "@/actions/subscriptions";
import { getAuthUser } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/use-notification";
import { useDisclosure } from "@mantine/hooks";
import { v4 as uuid } from "uuid";
import { Logo } from "@/components/Logo";
import { KeyModal } from "@components/KeyModal/KeyModal";
import styles from "./registration-stepper.module.css";

const REGISTRATION_STEPS = 3;

export function RegistrationStepper({
  StepOne,
  StepTwo,
  StepThree,
}: {
  StepOne: React.ReactElement;
  StepTwo: React.ReactElement;
  StepThree: React.ReactElement;
}) {
  const [active, setActive] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [key, setKey] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const { updateData, registrationData } = useRegistration();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const disabled =
      active >= 2
        ? false
        : active >= REGISTRATION_STEPS - 1 ||
          (active === 0 && !registrationData?.subnet) ||
          (active === 1 && !registrationData?.validator);
    setDisabled(disabled);
  }, [registrationData, active]);

  const nextStep = () =>
    setActive((current) =>
      current < REGISTRATION_STEPS ? current + 1 : current
    );

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleStepChange = (value: number) => {
    updateData({ currentStep: value } as RegistrationData);
  };

  const handleCompleteRegistration = async () => {
    setLoading(true);
    const currentUser = await getAuthUser();
    const userId = currentUser?.id;
    const endpointId = registrationData?.validator?.endpoints?.[0].id as string;
    const shortId = generateShortId(currentUser?.id as string, endpointId);

    try {
      const { result, error: CreateKeyError } = await createKey({
        name: `${currentUser?.user_metadata?.user_name}_request_key_${shortId}`,
        ownerId: userId,
        meta: {
          shortId,
          type: "consumer",
          endpointId,
          validatorId: registrationData?.validator?.id,
          customEndpoint: registrationData?.validator?.endpoints?.[0].url,
        },
      });

      if (CreateKeyError) return;
      const { key, keyId } = result;

      const res = await createSubscription({
        id: uuid(),
        userId,
        endpointId,
        key,
        keyId,
      } as SubscriptionType);

      if (res?.error) return notifyError(res?.message);
      notifySuccess(res?.message as string);
      setKey(key);
      open();
    } catch (error: Error | unknown) {
      throw new Error((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stepper
        active={active}
        onStepClick={() => handleStepChange(active)}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Subnet" description="Browse a Subnet Topic">
          <StepOne.type {...StepOne.props} />
        </Stepper.Step>
        <Stepper.Step label="Validator" description="Select a Validator">
          <StepTwo.type {...StepTwo.props} />
        </Stepper.Step>
        <Stepper.Step label="Review" description="Review Selection">
          <StepThree.type {...StepThree.props} />
        </Stepper.Step>
        <Stepper.Completed>
          <Title my="xl" order={2} ta="center">
            Confirm Registration
          </Title>
          <Text size="sm">
            Congratulations! You're one click away from your making your first
            request, integrating your app, and start building!
          </Text>
          <Box>
            <KeyModal
              apiKey={key}
              opened={opened}
              close={close}
              onCopy={() => setKey("")}
              modalTitle="Congratulations!"
              keyTitle="API Access Key"
              Action={
                <Box>
                  <Button
                    w="100%"
                    loading={loading}
                    onClick={() => router.push("/dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </Box>
              }
            />
          </Box>
          <Box my={50}>
            <Logo />
          </Box>
        </Stepper.Completed>
      </Stepper>
      <Group justify="center" mt="xl">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        {active !== 3 && (
          <Button onClick={nextStep} disabled={disabled}>
            {active === 0
              ? "Validator Selection"
              : active === 1
              ? "Review Selection"
              : "Continue"}
          </Button>
        )}
        {active === 3 && (
          <Button
            onClick={handleCompleteRegistration}
            disabled={disabled}
            loading={loading}
          >
            Complete Registration
          </Button>
        )}
      </Group>
    </>
  );
}
