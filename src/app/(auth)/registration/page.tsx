import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { endpoints, validators } from "@/db/schema";
import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import { getValidators } from "@/actions/validators";
import { Registration } from "@/components/Registration";
import { getSubscriptions } from "@/actions/subscriptions";
import { fetchValidatorInfo } from "@/actions/bittensor/bittensor";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";

export default async function Page() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }
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

  const validatorArr = await getValidators({
    where: and(eq(validators.verified, true)),
    with: {
      endpoints: {
        where: and(eq(endpoints.enabled, true)),
      },
    },
  });

  const subscriptions = await getSubscriptions({ userId: user.id });

  const fetchAllValidatorInfo = async (
    validatorArr: ValidatorType[],
    subnets: SubnetType[]
  ) => {
    try {
      const validatorWithInfo = await Promise.all(
        (validatorArr || []).map(async (validator) => {
          const endpointsWithInfo = await Promise.all(
            (validator?.endpoints! || [])?.map(async (endpoint) => {
              const netUid = subnets.find(
                (subnet) => subnet.id === endpoint.subnet
              )?.netUid;
              if (!netUid) {
                console.error(
                  "No netUid found for subnet ID:",
                  endpoint.subnet
                );
                return endpoint;
              }
              try {
                const stats = await fetchValidatorInfo(
                  netUid,
                  validator.hotkey!
                );

                return { ...endpoint, stats };
              } catch (error: Error | unknown) {
                console.error(
                  "Failed to fetch validator info for:",
                  validator.hotkey,
                  "with error:",
                  error
                );
                return { ...endpoint, error: (error as Error)?.message };
              }
            })
          );
          return { ...validator, endpoints: endpointsWithInfo };
        })
      );

      return validatorWithInfo;
    } catch (error) {
      throw error;
    }
  };

  const validatorWithInfo = await fetchAllValidatorInfo(validatorArr, subnets!);

  return (
    <Registration
      currentSubscriptions={subscriptions}
      validators={validatorWithInfo}
      subnets={subnets!}
    />
  );
}
