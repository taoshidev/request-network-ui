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


  const fetchAllValidatorInfo = async (//"5ELCYyfrr8jsHpDqTW5qFcdSfNeSvmLBh6cexfak94dNroHK"
    validatorArr: ValidatorType[],
    subnets: SubnetType[]
  ) => {
    try {
      const validatorWithInfo = await Promise.all(
        validatorArr.map(async (validator) => {
          const endpointsWithInfo = await Promise.all(
            validator.endpoints.map(async (endpoint) => {
              const netUid = subnets.find(
                (subnet) => subnet.id === endpoint.subnet
              )?.netUid;
              if (!netUid) {
                console.error(
                  "No netUid found for subnet ID:",
                  endpoint.subnet
                );
                return endpoint; // Return the endpoint unchanged if no netUid is found
              }
              try {
                console.log(netUid, validator.hotkey)
                const stats = await fetchValidatorInfo(netUid, validator.hotkey);
               // const info = await fetchValidatorInfo(1, "5ELCYyfrr8jsHpDqTW5qFcdSfNeSvmLBh6cexfak94dNroHK");

                return { ...endpoint, stats };
              } catch (error) {
                console.error(
                  "Failed to fetch validator info for:",
                  validator.hotkey,
                  "with error:",
                  error
                );
                return { ...endpoint, error: error?.message }; // Include error info in the endpoint data
              }
            })
          );
          return { ...validator, endpoints: endpointsWithInfo };
        })
      );


      return validatorWithInfo;
    } catch (error) {
      console.error("Error fetching validator information:", error);
      throw error;
    }
  };

  const validatorWithInfo = await fetchAllValidatorInfo(validatorArr, subnets);


  // if (registrationData?.subnet?.endpoints) {
  //   const fetchData = async () => {
  //     const validatorsWithInfo = await Promise.all(
  //       registrationData.subnet.endpoints.flatMap(
  //         async (endpoint: EndpointType) => {
  //           const validator = endpoint?.validators;
  //           console.log("registrationData.subnet.netUid, validator.hotkey", registrationData.subnet.netUid, validator.hotkey)
  //           const info = await fetchValidatorInfo(1, "5ELCYyfrr8jsHpDqTW5qFcdSfNeSvmLBh6cexfak94dNroHK");
  //           return { ...validator, info };
  //           //return validator;
  //         }
  //       )
  //     );
  //     console.log("validator:::::", validatorsWithInfo);

  //     setFilteredValidators(validatorsWithInfo);
  //   };

  return (
    <Registration
      currentSubscriptions={subscriptions}
      validators={validatorWithInfo}
      subnets={subnets}
    />
  );
}
