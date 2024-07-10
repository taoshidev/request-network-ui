import { eq, and, asc } from "drizzle-orm";
import { endpoints, validators, subscriptions } from "@/db/schema";
import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import { getValidators } from "@/actions/validators";
import { Registration } from "@/components/Registration/Registration";
import { getSubscriptions } from "@/actions/subscriptions";
import { fetchValidatorInfo } from "@/actions/bittensor/bittensor";
import { ValidatorType, ValidatorWithInfo } from "@/db/types/validator";
import ClientRedirect from "@/components/ClientRedirect";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) return;

  if (user?.user_metadata?.role !== "consumer") {
    return <ClientRedirect href="/dashboard" />;
  } else if (!user.user_metadata?.onboarded) {
    return <ClientRedirect href="/onboarding" />;
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

  const validatorArr = await getValidators(
    {
      where: and(eq(validators.verified, true)),
      columns: {
        apiKey: false,
        apiSecret: false,
      },
      with: {
        endpoints: {
          where: and(eq(endpoints.enabled, true)),
          with: {
            contract: {
              with: {
                services: true,
              },
            },
          },
          orderBy: [asc(endpoints?.url), asc(endpoints?.percentRealtime)],
        },
      },
    },
    { withStatus: true }
  );

  const userSubscriptions = await getSubscriptions({
    where: and(eq(subscriptions.userId, user?.id!)),
    with: {
      endpoint: {
        with: {
          validator: true,
        },
      },
    },
  });

  const fetchAllValidatorInfo = async (validatorArr: ValidatorWithInfo[]) => {
    const fetchNeuronInfo = async (endpoint, validator) => {
      if (!endpoint?.subnetId) return { error: "Net UID not found" };
      try {
        return await fetchValidatorInfo(
          validator?.bitensorNetUid,
          validator?.hotkey,
          validator?.bittensorUid
        );
      } catch (error) {
        return { error: (error as Error).message };
      }
    };

    try {
      const validatorsWithStats = await Promise.all(
        (validatorArr.length ? validatorArr : [])?.map(async (validator) => {
          const stats = await Promise.all(
            validator?.endpoints?.map(
              async (endpoint) => await fetchNeuronInfo(endpoint, validator)
            ) || []
          );

          const accumulatedStats = stats.reduce(
            (acc, curr) => (curr && !curr?.error ? { ...acc, ...curr } : acc),
            {}
          );
          return { ...validator, neuronInfo: accumulatedStats };
        })
      );

      return validatorsWithStats;
    } catch (error) {
      throw error;
    }
  };

  const validatorWithInfo = await fetchAllValidatorInfo(validatorArr);

  return (
    <Registration
      user={user}
      currentSubscriptions={userSubscriptions}
      validators={validatorWithInfo}
      subnets={subnets!}
    />
  );
}
