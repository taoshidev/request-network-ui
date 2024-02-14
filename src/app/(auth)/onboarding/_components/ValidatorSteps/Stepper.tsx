"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Center,
  Box,
  Button,
  Stepper as MantineStepper,
} from "@mantine/core";

import { Create } from "./Create";
import { Verify } from "./Verify";
import { Limits } from "./Limits";

export function Stepper({ user }: any) {
  const router = useRouter();

  // set current step to the user's onboarding step
  const [currentStep, setCurrentStep] = useState(
    user.user_metadata.onboarding.step
  );

  const nextStep = () => {
    const newStep = currentStep < 3 ? currentStep + 1 : currentStep;
    setCurrentStep(newStep);
  };

  useEffect(() => {
    if (currentStep === 3) {
      router.push("/dashboard");
    }
  }, [currentStep, router]);

  return (
    <Container h="100%">
      <Center>
        <Box w={800}>
          <MantineStepper
            radius={0}
            active={currentStep}
            onStepClick={setCurrentStep}
            allowNextStepsSelect={false}
          >
            <MantineStepper.Step
              label="Verify"
              description="Verify your Validator"
            >
              <Create onComplete={nextStep} user={user} />
            </MantineStepper.Step>
            <MantineStepper.Step label="Create" description="Verify email">
              <Verify onComplete={nextStep} user={user} />
            </MantineStepper.Step>
            <MantineStepper.Step
              label="Final step"
              description="Get full access"
            >
              <Limits onComplete={nextStep} user={user} />
            </MantineStepper.Step>
            <MantineStepper.Completed>
              Completed, click back button to get to previous step
            </MantineStepper.Completed>
          </MantineStepper>
        </Box>
      </Center>
    </Container>
  );
}
