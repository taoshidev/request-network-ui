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
            <MantineStepper.Step
              label="Choose a Validator"
              description="Verify email"
            >
              Velit excepteur Lorem proident laborum reprehenderit nisi officia
              eiusmod commodo in in laborum incididunt aliquip fugiat.
            </MantineStepper.Step>
            <MantineStepper.Step
              label="Copy Authentication"
              description="Get full access"
            >
              Mollit magna labore id irure consectetur cillum excepteur aliqua.
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
