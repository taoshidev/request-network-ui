"use client";

import { UserType } from "@/db/types/user";
import { ValidatorWithInfo } from "@/db/types/validator";
import { Alert, Box, Group, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import clsx from "clsx";
import useSWR from "swr";
import { getValidatorStatusPage } from "@/actions/validators";
import { cloneDeep as _cloneDeep } from "lodash";
import ValidatorStatusCard from "./ValidatorStatusCard";

const requestRate = 10000; // send request every 10 seconds

export default function ValidatorStatus({
  user,
  initialValidators,
}: {
  user: UserType;
  initialValidators: ValidatorWithInfo[];
}) {
  const { data: validators } = useSWR(
    "/validator-status",
    async () => {
      try {
        return await getValidatorStatusPage(user);
      } catch (e) {
        return validators;
      }
    },
    {
      fallbackData: initialValidators,
      refreshInterval: requestRate,
    }
  );

  return (
    <Box>
      <Group
        className={clsx(
          "flex items-stretch grid grid-cols-1 gap-5 justify-items-stretch",
          validators?.length && "md:grid-cols-2 lg:grid-cols-3 "
        )}
      >
        {!validators?.length ? (
          <Alert
            className="w-full mt-8 shadow-sm"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-2 text-base">
              There are no validators available at the moment.{" "}
              {user?.user_metadata?.role === "validator" ? (
                <>Create new validators to view them from this page.</>
              ) : (
                <>Please check back soon!</>
              )}
            </Text>
          </Alert>
        ) : (
          validators?.map((validator) => (
            <ValidatorStatusCard key={validator.id} validator={validator} />
          ))
        )}
      </Group>
    </Box>
  );
}
