"use client";

import { Fragment } from "react";
import { Endpoints } from "@/components/Endpoints";
import { Validators } from "../Validators";

export function ValidatorDashboard({
  user,
  endpoints,
  validators,
  subnets,
}: any) {
  return (
    <Fragment>
      <Validators user={user} validators={validators} subnets={subnets} />
      <Endpoints
        user={user}
        endpoints={endpoints}
        validators={validators}
        subnets={subnets}
      />
    </Fragment>
  );
}
