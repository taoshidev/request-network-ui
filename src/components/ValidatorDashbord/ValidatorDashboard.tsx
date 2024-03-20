"use client";

import { Endpoints } from "@/components/Endpoints";
import { Validators } from "../Validators";

export function ValidatorDashboard({
  user,
  endpoints,
  validators,
  subnets,
}: any) {
  return (
    <>
      <Validators user={user} validators={validators} subnets={subnets} />
      <Endpoints user={user} endpoints={endpoints} validators={validators} subnets={subnets} />
    </>
  );
}
