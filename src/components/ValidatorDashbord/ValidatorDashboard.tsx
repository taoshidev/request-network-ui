"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "@/components/Validators";
import { ValidatorStatTable } from "@/components/ValidatorStatTable";

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
      {validators?.length && (
        <>
          <Endpoints
            endpoints={endpoints}
            validators={validators}
            subnets={subnets}
          />
          <ValidatorStatTable data={stats} />
        </>
      )}
    </Fragment>
  );
}
