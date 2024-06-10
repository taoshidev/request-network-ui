"use client";

import { useState } from "react";
import { Box, Button } from "@mantine/core";
import { createEndpoint } from "@/actions/endpoints";
import { NOTIFICATION_TYPE, useNotification } from "@/hooks/use-notification";
import EndpointForm from "./AddValidator/steps/EndpointForm";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { getAuthUser } from "@/actions/auth";
import { ContractType } from "@/db/types/contract";
import { sendNotification } from "@/actions/notifications";

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

      sendNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        subject: "New Endpoint Created!",
        content: `Your new endpoint has been created.\r\n\r\<div style="text-align: left">**Endpoint Path:** ${values.url}<div>`,
        fromUserId: user?.id,
        userNotifications: [user],
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
      <Box mt="xl" className="sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
        <Button type="submit" w="100%" loading={loading}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
