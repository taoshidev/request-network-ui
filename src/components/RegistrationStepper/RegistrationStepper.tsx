"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  useRegistration,
  RegistrationData,
  defaultContextValue,
} from "@/providers/registration";
import { createKey, updateKey } from "@/actions/keys";
import {
  createSubscription,
  updateSubscription,
} from "@/actions/subscriptions";
import { getAuthUser } from "@/actions/auth";
import { useNotification } from "@/hooks/use-notification";
import { Logo } from "@/components/Logo";
import { KeyModal, keyType } from "@components/KeyModal";
import Loading from "@/app/(auth)/loading";
import { SubscriptionType } from "@/db/types/subscription";
import { sendToProxy } from "@/actions/apis";
import { z, ZodIssue } from "zod";
import { isValidEthereumAddress } from "@/utils/address";
import { sendEmail } from "@/actions/email";
import { isCrypto } from "@/utils/is-crypto";

const domainSchema = z.object({
  appName: z.string().min(1, { message: "Application name is required" }),
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
  consumerWalletAddress: z
    .string()
    .min(42, {
      message:
        "Wallet address must be at least 42 characters long including the '0x' prefix",
    })
    .max(42, {
      message:
        "Wallet address must be no more than 42 characters long including the '0x' prefix",
    })
    .refine(isValidEthereumAddress, {
      message: "Please enter a valid Ethereum wallet address",
    })
    .optional(),
});

const REGISTRATION_STEPS = 4;
interface StepText {
  [key: string | number]: string;
}

const stepText: StepText = {
  "0": "Validator Selection",
  "1": "Endpoint Selection",
  "2": "Review Selection",
  "3": "Continue",
};

export function RegistrationStepper({
  StepOne,
  StepTwo,
  StepThree,
  StepFour,
}: {
  StepOne: React.ReactElement;
  StepTwo: React.ReactElement;
  StepThree: React.ReactElement;
  StepFour: React.ReactElement;
}) {
  const [keys, setKeys] = useState<{
    apiKey: string;
    apiSecret: string;
    walletAddress: string;
    endpoint: string;
  }>({
    apiKey: "",
    apiSecret: "",
    walletAddress: "",
    endpoint: "",
  });
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const { updateData, registrationData } = useRegistration();
  const [active, setActive] = useState(+registrationData?.currentStep || 0);
  const { notifySuccess, notifyError } = useNotification();
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ZodIssue[]>([]);
  const [disabled, setDisabled] = useState(true);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextStep = () => {
    setActive((current) =>
      current < REGISTRATION_STEPS ? current + 1 : current
    );
    updateData({
      currentStep: active < REGISTRATION_STEPS ? active + 1 : active,
    });
    scrollToTop();
  };

  const prevStep = () => {
    setActive((current) => (current > 0 ? current - 1 : current));
    updateData({ currentStep: active > 0 ? active - 1 : active });
    scrollToTop();
  };

  const handleStepChange = (value: number) => {
    updateData({ currentStep: value } as RegistrationData);
  };

  const isLastStep = useMemo(() => active !== REGISTRATION_STEPS, [active]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => updateData(defaultContextValue.registrationData), []);

  useEffect(() => {
    if (registrationData) {
      setActive(registrationData.currentStep);
    }
    setPageLoading(false);
  }, [registrationData]);

  useEffect(() => {
    const disabled =
      active >= 3
        ? false
        : active >= REGISTRATION_STEPS - 1 ||
          (active === 0 && !registrationData?.subnet) ||
          (active === 1 && !registrationData?.validator) ||
          (active === 2 && !registrationData?.endpoint);
    setDisabled(disabled);
  }, [registrationData, active]);

  const handleCompleteRegistration = async () => {
    if (errors) setErrors([]);
    const selectedService = registrationData?.endpoint?.selectedService;
    const consumerApiUrl = registrationData?.consumerApiUrl;
    const appName = registrationData?.appName;
    const consumerWalletAddress = registrationData?.consumerWalletAddress || "";
    const consumerAppInfo: {
      consumerApiUrl: string;
      appName: string;
      consumerWalletAddress?: string;
    } = {
      consumerApiUrl,
      appName,
    };

    if (isCrypto(selectedService)) {
      consumerAppInfo.consumerWalletAddress = consumerWalletAddress;
    }

    const validationResult = domainSchema.safeParse(consumerAppInfo);

    if (!validationResult.success) {
      setErrors((validationResult as any)?.error?.issues as ZodIssue[]);
      return;
    }

    setLoading(true);

    const currentUser = await getAuthUser();
    const { subnet, validator, endpoint } = registrationData!;
    // const subnet = registrationData?.subnet;
    // const validator = registrationData?.validator;
    // const endpoint = registrationData?.endpoint;
    const userId = currentUser?.id;
    const apiId = validator?.apiId!;
    const validatorId = validator?.id!;

    const endpointId = endpoint?.id;
    const shortId = generateShortId(
      currentUser?.id as string,
      validatorId,
      endpointId,
      selectedService?.id
    );

    try {
      const refill = {
        interval: "daily",
        amount: 100,
      };

      const ratelimit = {
        type: "fast",
        limit: selectedService?.limit || 10,
        refillRate: selectedService?.refillRate || 1,
        refillInterval: selectedService?.refillInterval || 60,
      };

      const meta = {
        shortId,
        type: "consumer",
        consumerId: userId,
        endpointId,
        consumerServiceId: selectedService?.id,
        consumerWalletAddress,
        currencyType: selectedService?.currencyType,
        validatorWalletAddress: validator?.walletAddress,
        hotkey: registrationData?.validator?.hotkey,
        endpoint: `${validator?.baseApiUrl}${endpoint?.url}`,
        validatorId,
        subscription: {} as SubscriptionType,
        proxyServiceId: ''
      };

      const keyPayload: { [key: string]: any; expires?: string | number } = {
        name: appName?.split(" ").join(""),
        ownerId: userId,
        roles: ["consumer"],
        remaining: +selectedService?.remaining,
        refill,
        ratelimit,
        meta,
      };

      if (selectedService?.expires || selectedService?.expires?.length > 0) {
        keyPayload.expires = new Date(selectedService?.expires)?.getTime();
      }

      const { result, error: CreateKeyError } = await createKey(
        apiId,
        keyPayload
      );

      if (CreateKeyError) return;

      const { key, keyId } = result as { key: string; keyId: string };

      const res = await createSubscription({
        userId,
        validatorId,
        endpointId,
        key,
        keyId,
        appName,
        consumerApiUrl,
        consumerWalletAddress,
        serviceId: selectedService?.id,
        contractId: registrationData?.endpoint?.contract?.id
      } as SubscriptionType);

      if (res?.error)
        return notifyError(
          res?.message || "Something went wrong creating subscription"
        );

      const subscription = res?.data?.[0];
      meta.subscription = subscription;

      const { id: subscriptionId, apiSecret } = subscription;

      const proxyRes = await sendToProxy({
        endpoint: {
          url: validator?.baseApiUrl!,
          method: "POST",
          path: "/register-consumer",
        },
        validatorId,
        data: {
          type: "consumer",
          name: appName,
          validatorId,
          endpointId,
          subscriptionId,
          consumerKeyId: keyId,
          consumerServiceId: selectedService?.id,
          consumerApiUrl,
          currencyType: selectedService?.currencyType,
          consumerWalletAddress: subscription?.consumerWalletAddress,
          hotkey: registrationData?.validator?.hotkey,
          validatorWalletAddress: validator?.walletAddress,
          price: selectedService?.price,
          meta,
        },
      });

      if (proxyRes?.error) {
        return notifyError(proxyRes?.error);
      }

      const updateRes = await updateSubscription({
        id: subscriptionId,
        // NOTE: This is the serviceId coming from the proxy
        proxyServiceId: proxyRes?.serviceId,
      });
      if (updateRes?.error)
        return notifyError(
          updateRes?.message || "Something went wrong updating subscription"
        );

      meta.proxyServiceId = proxyRes.serviceId;
      meta.subscription.proxyServiceId = proxyRes.serviceId;

      await updateKey({
        keyId,
        params: {
          meta,
        },
      });

      notifySuccess(res?.message as string);
      setKeys({
        apiKey: key,
        apiSecret: apiSecret!,
        walletAddress: validator?.walletAddress!,
        endpoint: `${validator?.baseApiUrl}${endpoint?.url}`,
      });
      open();

      // send subscribed email to client
      if (
        currentUser &&
        currentUser?.email &&
        currentUser.user_metadata?.role === "consumer"
      ) {
        sendEmail({
          to: currentUser.email,
          template: "subscription-created",
          subject: `Subscribed to Validator ${appName}`,
          templateVariables: { appName },
        });
      }
    } catch (error: Error | unknown) {
      throw new Error((error as Error)?.message);
    } finally {
      setLoading(false);
      updateData({
        appName: "",
        consumerApiUrl: "",
        consumerWalletAddress: "",
      });
    }
  };

  const handleKeyModalClose = () => {
    router.push("/dashboard");
    updateData(defaultContextValue.registrationData);
    close();
  };

  return pageLoading ? (
    <Loading />
  ) : (
    <>
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        walletAddress={keys?.walletAddress}
        endpoint={keys?.endpoint}
        opened={opened}
        onClose={handleKeyModalClose}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="Api Access Key"
        walletAddressTitle={
          isCrypto(registrationData?.endpoint?.selectedService)
            ? "Validator's ERC-20 Public Address"
            : undefined
        }
        endpointTitle="Validator's Resource Endpoint"
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

        <Stepper.Step label="Endpoint" description="Select an Endpoint">
          <StepThree.type {...StepThree.props} />
        </Stepper.Step>

        <Stepper.Step label="Review" description="Review Selection">
          <StepFour.type {...StepFour.props} />
        </Stepper.Step>

        <Stepper.Completed>
          <Card withBorder shadow="sm" padding="lg" className="mt-14 h-auto">
            <Center className="mt-8 mb-4">
              <Box className="max-w-xl">
                <Text className="text-center text-xl mb-4">
                  Congratulations!
                </Text>
                <Text className="text-center text-sm">
                  You&apos;re one step away from your making your first request,
                  integrating your app, and start building! Tell us your
                  application, domain name and attach an ERC-20 Wallet address
                  so that we can get you started. The wallet address is the
                  public address of the ERC-20 wallet you want to use to make
                  monthly payment.
                </Text>
                <Box className="mt-7">
                  <TextInput
                    label="Application Name"
                    className="mb-4"
                    withAsterisk
                    value={registrationData?.appName}
                    onChange={(e) => {
                      updateData({
                        appName: e.target.value,
                      } as RegistrationData);
                      if (errors) setErrors([]);
                    }}
                    error={
                      errors?.find((e) => e.path.includes("appName"))?.message
                    }
                    placeholder="Application Name"
                  />
                  <TextInput
                    label="Your Domain Name"
                    withAsterisk
                    value={registrationData?.consumerApiUrl}
                    onChange={(e) => {
                      updateData({
                        consumerApiUrl: e.target.value,
                      } as RegistrationData);
                      if (errors) setErrors([]);
                    }}
                    error={
                      errors?.find((e) => e.path.includes("consumerApiUrl"))
                        ?.message
                    }
                    placeholder="https://mysite.com"
                  />
                  {isCrypto(registrationData?.endpoint?.selectedService) && (
                    <TextInput
                      label="Wallet Address"
                      className="mt-4"
                      withAsterisk
                      value={registrationData?.consumerWalletAddress}
                      onChange={(e) => {
                        updateData({
                          consumerWalletAddress: e.target.value,
                        } as RegistrationData);
                        if (errors) setErrors([]);
                      }}
                      error={
                        errors?.find((e) =>
                          e.path.includes("consumerWalletAddress")
                        )?.message
                      }
                      placeholder="0xe985528e9BC951a462BCFAb6f3B1F395DF9aeA3e"
                    />
                  )}
                </Box>
              </Box>
            </Center>
            <Box>
              <Logo size={75} />
            </Box>
          </Card>
        </Stepper.Completed>
      </Stepper>

      <Group className="justify-center mt-14">
        <Button variant="default" onClick={prevStep} disabled={active === 0}>
          Back
        </Button>
        {isLastStep ? (
          <Button onClick={nextStep} disabled={disabled}>
            {stepText[active]}
          </Button>
        ) : (
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
