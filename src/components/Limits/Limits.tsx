"use client";

import { useState } from "react";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { v4 as uuid } from "uuid";
import { createEndpoint } from "@/actions/endpoints";
import { useNotification } from "@/hooks/use-notification";
import { EndpointFormInput } from "@components/EndpointFormInput";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { sendEmail } from "@/actions/email";
import { getAuthUser } from "@/actions/auth";

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
      subnetId: "",
      validatorId: "",
      currencyType: "Crypto",
      walletAddress: "",
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
      const user = await getAuthUser();
      const res = await createEndpoint(values as EndpointType);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message);

      sendEmail({
        to: user?.email as string,
        template: "created-endpoint",
        subject: "New Endpoint Created",
        templateVariables: {
          endPointPath: values.url,
          expires: new Date(values.expires),
          limit: values.limit,
          refillRate: values.refillRate,
          refillInterval: values.refillInterval,
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
