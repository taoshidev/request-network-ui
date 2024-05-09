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
          validator: {
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
    const subnetMap = new Map(
      subnets?.map((subnet) => [subnet.id, subnet.netUid])
    );

    const fetchEndpointInfo = async (endpoint, validator) => {
      const netUid = subnetMap.get(endpoint.subnetId);
      if (!netUid) {
        console.error("No netUid found for subnet ID:", endpoint.subnetId);
        return { error: "Net UID not found" };
      }
      try {
        const stats = await fetchValidatorInfo(netUid, validator.hotkey);
        return stats;
      } catch (error) {
        console.error(
          "Failed to fetch validator info for:",
          validator.hotkey,
          "with error:",
          error
        );
        return { error: (error as Error).message };
      }
    };

    try {
      const validatorsWithStats = await Promise.all(
        (validatorArr || []).map(async (validator) => {
          const stats = await Promise.all(
            validator?.endpoints?.map((endpoint) =>
              fetchEndpointInfo(endpoint, validator)
            ) || []
          );

          const accumulatedStats = stats.reduce((acc, curr) => {
            if (curr && !curr?.error) {
              return { ...acc, ...curr };
            }
            return acc;
          }, {});

          return { ...validator, neuronInfo: accumulatedStats };
        })
      );

      return validatorsWithStats;
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
