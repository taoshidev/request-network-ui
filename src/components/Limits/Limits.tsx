"use client";

import { useState } from "react";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { createEndpoint } from "@/actions/endpoints";
import { useNotification } from "@/hooks/use-notification";
import { EndpointFormInput } from "@components/EndpointFormInput";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";

export function Limits({
  onComplete,
  validators,
  subnets,
}: {
  onComplete: () => void;
  validators: Array<ValidatorType>;
  subnets: Array<SubnetType>;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const form = useForm<Partial<EndpointType>>({
    name: "create-new-endpoint",
    initialValues: {
      id: uuid(),
      limit: 10,
      url: "",
      subnet: "",
      validator: "",
      currencyType: "Fiat",
      price: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
    },
    validate: zodResolver(EndpointSchema),
  });

  const onSubmit = async (values: Partial<EndpointType>) => {
    setLoading(true);

    try {
      const res = await createEndpoint(values as EndpointType);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message);
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <EndpointFormInput
        form={form}
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
