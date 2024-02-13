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
  // neet to set state based on user data
  const [currentStep, setCurrentStep] = useState(0);
  const nextStep = () =>
    setCurrentStep((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setCurrentStep((current) => (current > 0 ? current - 1 : current));

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
        <Box mt="xl">
          <Button type="submit" w="100%" onClick={nextStep}>
            Create
          </Button>
        </Box>
      </Center>
    </Container>
  );
}
