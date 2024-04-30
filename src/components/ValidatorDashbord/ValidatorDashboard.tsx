"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";
import { Divider } from "@mantine/core";

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
      <Divider variant="dashed"/>
      {validators?.length > 0 && (
        <>
          <Endpoints
            endpoints={endpoints}
            validators={validators}
            subnets={subnets}
          />
          <Divider variant="dashed"/>
          {stats.length > 0 && <ValidatorStatTable data={stats} />}
        </>
      )}
    </Fragment>
  );
}
