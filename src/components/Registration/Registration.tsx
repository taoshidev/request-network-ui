"use client";

import {
  RegistrationProvider,
  useRegistration,
} from "@/providers/registration";
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
import clsx from "clsx";

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
  const { registrationData } = useRegistration();
  
  return (
    <RegistrationProvider>
      <RegistrationStepper
        StepOne={
          <object
            style={{ height: "100%", marginBottom: "100px" }}
            className={clsx("w-full slide", registrationData.direction)}
            type="application/pdf"
            data="/request-network-terms-of-service.pdf#view=FitH&scrollbar=0&navpanes=0"
          >
            <p>
              File can not be displayed in browser.{" "}
              <a href="/request-network-terms-of-service.pdf">
                Request Network Terms of Service
              </a>
            </p>
          </object>
        }
        StepTwo={
          validators?.length! > 0 ? (
            <Subnets subnets={subnets} mode="registration" />
          ) : (
            <Alert
              className={clsx(
                "mt-8 shadow-sm slide",
                registrationData.direction
              )}
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
              className="mt-8 shadow-sm slide-in"
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
          <ValidatorEndpoint currentSubscriptions={currentSubscriptions} />
        }
        StepFive={<SubnetValidatorReview />}
      />
    </RegistrationProvider>
  );
}
