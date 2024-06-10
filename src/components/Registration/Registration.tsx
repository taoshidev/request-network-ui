"use client";

import { RegistrationProvider } from "@/providers/registration";
import { Subnets } from "@/components/Subnets";
import { SubnetValidator } from "@/components/SubnetValidator";
import { SubnetValidatorReview } from "@/components/RegistrationStepper/steps/SubnetValidatorReview";
import { RegistrationStepper } from "@/components/RegistrationStepper/RegistrationStepper";
import { SubscriptionType } from "@/db/types/subscription";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { ValidatorEndpoint } from "@/components/RegistrationStepper/steps/ValidatorEndpoint";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import clsx from "clsx";
import RegistrationTOS from "../RegistrationStepper/steps/RegistrationTOS";
import { useState } from "react";

type ValidatorWithInfo = ValidatorType & { neuronInfo: any };

export function Registration({
  currentSubscriptions,
  subnets,
  validators,
}: {
  currentSubscriptions: SubscriptionType[];
  subnets: SubnetType[];
  validators: ValidatorWithInfo[];
}) {
  const [direction, setDirection] = useState<"left" | "right">("left");

  return (
    <RegistrationProvider>
      <RegistrationStepper
        StepOne={<RegistrationTOS />}
        StepTwo={
          validators?.length! > 0 ? (
            <Subnets
              subnets={subnets}
              mode="registration"
              setDirection={setDirection}
            />
          ) : (
            <Alert
              className={clsx("mt-8 shadow-sm slide", direction)}
              color="orange"
              icon={<IconAlertCircle />}
            >
              <Text className="mb-2 text-base">
                There are no validators available at the moment. Please check
                back soon!
              </Text>
            </Alert>
          )
        }
        StepThree={
          validators?.length! > 0 ? (
            <SubnetValidator
              currentSubscriptions={currentSubscriptions}
              subnet={subnets?.[0] || {}}
              validators={validators}
              mode="registration"
            />
          ) : (
            <Alert
              className={clsx("mt-8 shadow-sm slide", direction)}
              color="orange"
              icon={<IconAlertCircle />}
            >
              <Text className="mb-2 text-base">
                There are no validators available at the moment. Please check
                back soon!
              </Text>
            </Alert>
          )
        }
        StepFour={
          <ValidatorEndpoint
            currentSubscriptions={currentSubscriptions}
          />
        }
        StepFive={<SubnetValidatorReview />}
      />
    </RegistrationProvider>
  );
}
