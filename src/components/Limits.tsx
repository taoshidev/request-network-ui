"use client";

import { useState } from "react";
import { Box, Button } from "@mantine/core";
import { createEndpoint } from "@/actions/endpoints";
import { useNotification } from "@/hooks/use-notification";
import EndpointForm from "./AddValidator/steps/EndpointForm";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { sendEmail } from "@/actions/email";
import { getAuthUser } from "@/actions/auth";
import { ContractType } from "@/db/types/contract";

export function Limits({
  form,
  onComplete,
  validators,
  subnets,
  contracts,
}: {
  form: any;
  onComplete: () => void;
  validators: Array<ValidatorType>;
  subnets: Array<SubnetType>;
  contracts: Array<ContractType>;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const onSubmit = async (values: Partial<EndpointType>) => {
    setLoading(true);

    try {
      const user = await getAuthUser();
      const res = await createEndpoint(values as EndpointType);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message);
      form.reset();

      sendEmail({
        to: user?.email as string,
        template: "created-endpoint",
        subject: "New Endpoint Created",
        templateVariables: {
          endPointPath: values.url
        },
      });
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <EndpointForm
        form={form}
        contracts={contracts}
        validators={validators}
        subnets={subnets}
      />
      <Box mt="xl">
        <Button type="submit" w="100%" loading={loading}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
