"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";
import { Alert, Divider, Text, Box } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { Contract } from "./Contract";

export function ValidatorDashboard({
  user,
  endpoints,
  validators,
  subnets,
  stats,
}: any) {
  return (
    <Fragment>
      <Validators user={user} validators={validators} subnets={subnets} />
      {validators?.length > 0 ? (
        <>
          <Divider variant="dashed" />
          <Endpoints
            endpoints={endpoints}
            validators={validators}
            subnets={subnets}
          />
          <Divider variant="dashed" />
          {stats.length > 0 && <ValidatorStatTable data={stats} />}
        </>
      ) : (
        <Alert color="orange" icon={<IconAlertCircle />}>
          <Text className="mb-2">
            You don&apos;t have any Validators yet. Add your Terms of Services
            an create your first Validator to start receiving customers.
          </Text>
          <Box className="flex justify-end">
            <Contract user={user} validators={validators} subnets={subnets} />
          </Box>
        </Alert>
      )}
    </Fragment>
  );
}
