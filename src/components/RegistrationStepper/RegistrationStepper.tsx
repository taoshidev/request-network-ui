"use client";

import { useState, useMemo } from "react";
import {
  Stepper,
  Button,
  Group,
  Text,
  Box,
  Title,
  Center,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { generateShortId } from "@/utils/ids";
import { useRegistration, RegistrationData } from "@/providers/registration";
import { createKey, updateKey } from "@/actions/keys";
import { createSubscription } from "@/actions/subscriptions";
import { getAuthUser } from "@/actions/auth";
import { useNotification } from "@/hooks/use-notification";
import { Logo } from "@/components/Logo";
import { KeyModal } from "@components/KeyModal";
import { EndpointType } from "@/db/types/endpoint";
import { SubscriptionType } from "@/db/types/subscription";
import { sendToProxy } from "@/actions/apis";

const REGISTRATION_STEPS = 3;

interface StepText {
  [key: string | number]: string;
}

const stepText: StepText = {
  "0": "Validator Selection",
  "1": "Review Selection",
  "2": "Continue",
};

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
  const [keys, setKeys] = useState<{ apiKey: string; apiSecret: string }>({
    apiKey: "",
    apiSecret: "",
  });
  const [opened, { open, close }] = useDisclosure(false);
  const { updateData, registrationData } = useRegistration();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    setActive((current) =>
      current < REGISTRATION_STEPS ? current + 1 : current
    );

    scrollToTop();
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));

    scrollToTop();
  };

  const handleStepChange = (value: number) => {
    updateData({ currentStep: value } as RegistrationData);
  };

  const isLastStep = useMemo(() => active !== 3, [active]);

  const isDisabled = useMemo(() => {
    return active >= 2
      ? false
      : active >= REGISTRATION_STEPS - 1 ||
          (active === 0 && !registrationData?.subnet) ||
          (active === 1 && !registrationData?.validator);
  }, [registrationData, active]);

  const handleCompleteRegistration = async () => {
    setLoading(true);

    const currentUser = await getAuthUser();
    const validator = registrationData?.validator;
    const userId = currentUser?.id;
    const endpointId = validator?.endpoints?.[0].id as string;
    const shortId = generateShortId(currentUser?.id as string, endpointId);
    const apiId = validator?.apiId;
    const validatorId = validator?.id;
    const endpoint = validator?.endpoints?.find(
      (e: EndpointType) => e.id === endpointId
    );

    try {
      const refill = {
        interval: "daily",
        amount: 100,
      };

      const ratelimit = {
        type: "fast",
        limit: endpoint?.limit || 10,
        refillRate: endpoint?.refillRate || 1,
        refillInterval: endpoint?.refillInterval || 60,
      };

      const meta = {
        shortId,
        type: "consumer",
        consumerId: userId,
        endpointId,
        customEndpoint: endpoint?.url,
        endpoint: endpoint?.url,
        validatorId,
        subscription: "",
      };

      const { result, error: CreateKeyError } = await createKey(apiId, {
        name: `${currentUser?.user_metadata?.user_name}_request_key_${shortId}`,
        ownerId: userId,
        roles: ["consumer"],
        expires: new Date(endpoint?.expires)?.getTime(),
        remaining: +endpoint?.remaining,
        refill,
        ratelimit,
        meta,
      });

      if (CreateKeyError) return;

      const { key, keyId } = result as { key: string; keyId: string };

      const res = await createSubscription({
        userId,
        endpointId,
        key,
        keyId,
      } as SubscriptionType);

      if (res?.error)
        return notifyError(
          res?.message || "Something went wrong creating subscription"
        );

      meta.subscription = res?.data?.[0];

      await updateKey({
        keyId,
        params: {
          meta,
        },
      });

      const proxyRes = await sendToProxy({
        endpoint: {
          url: endpoint?.url,
          method: "POST",
          path: "/register-consumer",
        },
        validatorId,
        data: {
          type: "consumer",
          rnConsumerRequestKey: keyId,
          rnConsumerApiUrl: endpoint?.url,
          rnValidatorHotkey: registrationData?.validator?.hotkey,
          rnValidatorMeta: meta,
        },
      });

      if (proxyRes) {
        notifySuccess(res?.message as string);
        setKeys({ apiKey: key, apiSecret: res?.data?.[0]?.apiSecret });
        open();
      }
    } catch (error: Error | unknown) {
      throw new Error((error as Error)?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={opened}
        onClose={close}
        onCopy={(key: "apiKey" | "apiSecret") =>
          setKeys((prev) => ({ ...prev, [key]: "" }))
        }
        title="API Access Key"
      />

      <Stepper
        size="sm"
        active={active}
        onStepClick={() => handleStepChange(active)}
        allowNextStepsSelect={false}
      >
        <Stepper.Step label="Subnet" description="Browse a Subnet">
          <StepOne.type {...StepOne.props} />
        </Stepper.Step>
        <Stepper.Step label="Validator" description="Select a Validator">
          <StepTwo.type {...StepTwo.props} />
        </Stepper.Step>
        <Stepper.Step label="Review" description="Review Selection">
          <StepThree.type {...StepThree.props} />
        </Stepper.Step>
        <Stepper.Completed>
          <Title className="text-center my-8 text-2xl">
            Confirm Registration
          </Title>
          <Card className="my-14">
            <Center className="mt-8 mb-14">
              <Box className="max-w-xl">
                <Text className="text-center text-sm mb-4">
                  Congratulations!
                </Text>
                <Text className="text-center text-sm">
                  You&apos;re one click away from your making your first
                  request, integrating your app, and start building!
                </Text>
              </Box>
            </Center>

            <Box className="my-8">
              <Logo />
            </Box>
          </Card>
        </Stepper.Completed>
      </Stepper>
      <Group className="justify-center mt-8">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        {isLastStep ? (
          <Button onClick={nextStep} disabled={isDisabled}>
            {stepText[active]}
          </Button>
        ) : (
          <Button
            onClick={handleCompleteRegistration}
            disabled={isDisabled}
            loading={loading}
          >
            Complete Registration
          </Button>
        )}
      </Group>
    </>
  );
}
