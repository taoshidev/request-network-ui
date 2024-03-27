"use client";

import { useState, useEffect } from "react";
import { Stepper, Button, Group, Text } from "@mantine/core";
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
import { v4 as uuid } from "uuid";

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
      router.push("/dashboard");
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
          <Text size="sm">
            Completed, click back button to get to previous step
          </Text>
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
