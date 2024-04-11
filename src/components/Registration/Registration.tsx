"use client";

import { Container } from "@mantine/core";
import { Subnets } from "@/components/Subnets";
import { SubnetValidator } from "@/components/SubnetValidator";
import { SubnetValidatorReview } from "@/components/SubnetValidatorReview";
import { RegistrationStepper } from "@/components/RegistrationStepper";

export function Registration({ subnets, validator }: any) {

  return (
    <Container className="my-10">
      <RegistrationStepper
        StepOne={<Subnets subnets={subnets} mode="registration" />}
        StepTwo={
          <SubnetValidator
            subnet={subnets?.[0] || {}}
            validators={validator}
            mode="registration"
          />
        }
        StepThree={<SubnetValidatorReview />}
      />
    </Container>
  );
}
