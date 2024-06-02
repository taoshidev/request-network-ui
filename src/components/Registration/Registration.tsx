"use client";

import { RegistrationProvider } from "@/providers/registration";
import { Subnets } from "@/components/Subnets";
import { SubnetValidator } from "@/components/SubnetValidator";
import { SubnetValidatorReview } from "@/components/SubnetValidatorReview";
import { RegistrationStepper } from "@/components/RegistrationStepper";
import { SubscriptionType } from "@/db/types/subscription";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { ValidatorEndpoint } from "@/components/ValidatorEndpoint";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

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
  console.log("validators::::", validators);
  return (
    <RegistrationProvider>
      <RegistrationStepper
        StepOne={<Subnets subnets={subnets} mode="registration" />}
        StepTwo={
          validators?.length! > 0 ? (
            <SubnetValidator
              currentSubscriptions={currentSubscriptions}
              subnet={subnets?.[0] || {}}
              validators={validators}
              mode="registration"
            />
          ) : (
            <Alert
              className="mt-8 shadow-sm"
              color="orange"
              icon={<IconAlertCircle />}
            >
              <Text className="mb-2 text-base">
                There are no validators available at the moment. Please check back soon!
              </Text>
            </Alert>
          )
        }
        StepThree={
          <ValidatorEndpoint currentSubscriptions={currentSubscriptions} />
        }
        StepFour={<SubnetValidatorReview />}
      />
    </RegistrationProvider>
  );
}
