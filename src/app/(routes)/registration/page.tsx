import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import { Subnets } from "@/components/Subnets";
import { SubnetValidator } from "@/components/SubnetValidator/SubnetValidator";
import { SubnetValidatorReview } from "@/components/SubnetValidatorReview";
import { RegistrationStepper } from "@/components/RegistrationStepper/RegistrationStepper";
import { Container } from "@mantine/core";
import { getValidators } from "@/actions/validators";
import { eq, and } from "drizzle-orm";
import { endpoints, validators } from "@/db/schema";

export default async function Page() {
  const user = await getAuthUser();
  const subnets = await getSubnets({
    with: {
      endpoints: {
        with: {
          validators: {
            with: {
              endpoints: true,
            },
          },
        },
      },
    },
  });

  const vali = await getValidators({
    where: and(eq(validators.verified, true)),
    with: {
      endpoints: {
        where: and(eq(endpoints.enabled, true)),
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <Container my={50}>
      <RegistrationStepper
        StepOne={<Subnets subnets={subnets} mode="registration" />}
        StepTwo={
          <SubnetValidator
            subnet={subnets?.[0] || {}}
            validators={vali}
            mode="registration"
          />
        }
        StepThree={<SubnetValidatorReview />}
      />
    </Container>
  );
}
