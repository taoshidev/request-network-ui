"use client";
import { RegistrationProvider } from "@/providers/registration";
import { Subnets } from "@/components/Subnets";
import { SubnetValidator } from "@/components/SubnetValidator";
import { SubnetValidatorReview } from "@/components/SubnetValidatorReview";
import { RegistrationStepper } from "@/components/RegistrationStepper";
import { SubscriptionType } from "@/db/types/subscription";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";

export function Registration({
  currentSubscriptions,
  subnets,
  validators,
}: {
  currentSubscriptions: SubscriptionType[];
  subnets: SubnetType[];
  validators: ValidatorType[];
}) {

  return (
    <RegistrationProvider>
      <RegistrationStepper
        StepOne={<Subnets subnets={subnets} mode="registration" />}
        StepTwo={
          <SubnetValidator
            currentSubscriptions={currentSubscriptions}
            subnet={subnets?.[0] || {}}
            validators={validators}
            mode="registration"
          />
        }
        StepThree={<SubnetValidatorReview />}
      />
    </RegistrationProvider>
  );
}
