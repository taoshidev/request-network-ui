"use client";

import { useState, useMemo } from "react";
import {
  Stepper,
  Button,
  Group,
  Text,
  Box,
  TextInput,
  Center,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { generateShortId } from "@/utils/ids";
import { useRegistration, RegistrationData } from "@/providers/registration";
import { createKey, updateKey } from "@/actions/keys";
import {
  createSubscription,
  updateSubscription,
} from "@/actions/subscriptions";
import { getAuthUser } from "@/actions/auth";
import { useNotification } from "@/hooks/use-notification";
import { Logo } from "@/components/Logo";
import { KeyModal, keyType } from "@components/KeyModal";
import { EndpointType } from "@/db/types/endpoint";
import { SubscriptionType } from "@/db/types/subscription";
import { sendToProxy } from "@/actions/apis";
import { z } from "zod";

const domainSchema = z.object({
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
});

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
  const [keys, setKeys] = useState<{
    apiKey: string;
    apiSecret: string;
    walletKey: string;
    endpoint: string;
  }>({
    apiKey: "",
    apiSecret: "",
    walletKey: "",
    endpoint: "",
  });
  const [opened, { open, close }] = useDisclosure(false);
  const { updateData, registrationData } = useRegistration();
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    if (error) setError("");

    const consumerApiUrl = registrationData?.consumerApiUrl;

    const validationResult = domainSchema.safeParse({
      consumerApiUrl,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setError(firstError.message);
      return;
    }

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
        endpoint: `${validator.baseApiUrl}${endpoint?.url}`,
        validatorId,
        subscription: {} as SubscriptionType,
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
        consumerApiUrl,
      } as SubscriptionType);

      if (res?.error)
        return notifyError(
          res?.message || "Something went wrong creating subscription"
        );

      meta.subscription = res?.data?.[0];

      const { id, apiSecret } = meta.subscription;

      await updateKey({
        keyId,
        params: {
          meta,
        },
      });

      const proxyRes = await sendToProxy({
        endpoint: {
          url: validator.baseApiUrl,
          method: "POST",
          path: "/register-consumer",
        },
        validatorId,
        data: {
          type: "consumer",
          consumerKeyId: keyId,
          consumerApiUrl,
          hotkey: registrationData?.validator?.hotkey,
          meta,
        },
      });

      if (proxyRes?.error) {
        return notifyError(proxyRes?.error);
      }

      if (proxyRes) {
        console.log("proxyRes", proxyRes.publicKey);
        const updateRes = await updateSubscription({
          id,
          escrowPublicKey: proxyRes?.publicKey,
        });
        console.log("updateRes", updateRes);
        if (updateRes?.error)
          return notifyError(
            updateRes?.message || "Something went wrong updating subscription"
          );

        notifySuccess(res?.message as string);
        setKeys({
          apiKey: key,
          apiSecret,
          walletKey: proxyRes?.publicKey,
          endpoint: `${validator.baseApiUrl}${endpoint?.url}`,
        });
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
        walletKey={keys?.walletKey}
        endpoint={keys?.endpoint}
        opened={opened}
        onClose={close}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="API Access Key"
        walletKeyTitle="Public Escrow Wallet Key"
        endpointTitle="Resource Endpoint"
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
          <Card className="mt-14 h-auto">
            <Center className="mt-8 mb-12">
              <Box className="max-w-xl">
                <Text className="text-center text-sm mb-4">
                  Congratulations!
                </Text>
                <Text className="text-center text-sm">
                  You&apos;re one step away from your making your first request,
                  integrating your app, and start building! Tell us your domain
                  name so that we can get you started.
                </Text>
                <Box className="mt-7">
                  <TextInput
                    withAsterisk
                    value={registrationData?.consumerApiUrl}
                    onChange={(e) => {
                      updateData({
                        consumerApiUrl: e.target.value,
                      } as RegistrationData);
                      if (error) setError("");
                    }}
                    error={error}
                    placeholder="https://example.com"
                  />
                </Box>
              </Box>
            </Center>
            <Box>
              <Logo />
            </Box>
          </Card>
        </Stepper.Completed>
      </Stepper>

      <Group className="justify-center mt-14">
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
