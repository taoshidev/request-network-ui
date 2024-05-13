"use client";

import { useState } from "react";
import { Title, Group, Box, Button, Switch, NavLink } from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { IconHome2, IconGauge, IconCircleOff } from "@tabler/icons-react";
import { updateEndpoint } from "@/actions/endpoints";
import { PostSchema } from "./PostSchema";
import { useNotification } from "@/hooks/use-notification";
import { useRouter } from "next/navigation";
import { EndpointFormInput } from "@/components/EndpointFormInput";
import { EndpointSchema } from "@/db/types/endpoint";
import { sendToProxy } from "@/actions/apis";
import { EndpointType } from "@/db/types/endpoint";
import { ContractType } from "@/db/types/contract";

const EndpointFormSchema = EndpointSchema.omit({
  validator: true,
  subscription: true,
});

export function UpdateEndpoint({
  endpoint,
  contracts,
  subscriptionCount,
}: {
  endpoint: EndpointType;
  contracts: ContractType[];
  subscriptionCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(endpoint.enabled);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      ...endpoint,
    },
    validate: zodResolver(EndpointFormSchema),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    // NOTE: must remove the keys otherwise it will fail silently
    delete values.validator;
    delete values.subscription;

    const { id } = endpoint;
    const { id: validatorId, baseApiUrl: url, apiPrefix } = endpoint?.validator;

    try {
      const res = await updateEndpoint({ id, ...values });
      if (res?.data) {
        await updateProxy(
          url,
          `${apiPrefix}/services/endpointId/${id}`,
          validatorId,
          {
            price: values.price,
          }
        );
      }

      if (res?.error) return notifyError(res?.message);
      notifySuccess(res.message);
      router.refresh();
      setTimeout(() => router.back(), 1000);
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnable = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;
    try {
      const res = await updateEndpoint({ id: endpoint.id, enabled: isEnabled });
      if (res?.error) return notifyError(res?.message);
      form.setValues({ enabled: isEnabled });

      if (endpoint?.validator) {
        const {
          id: validatorId,
          baseApiUrl: url,
          apiPrefix,
        } = endpoint.validator;

        await updateProxy(
          url,
          `${apiPrefix}/services/endpointId/${endpoint?.id}`,
          validatorId,
          {
            enabled: isEnabled,
          }
        );
      }

      notifySuccess(res.message);
      router.refresh();
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setEnabled(isEnabled);
    }
  };

  const updateProxy = async (
    url: string,
    path: string,
    validatorId: string,
    data: any
  ) => {
    return await sendToProxy({
      endpoint: {
        url,
        method: "PUT",
        path,
      },
      validatorId,
      data,
    });
  };

  return (
    <Group align="flex-start">
      <Box w={250}>
        <NavLink
          href="#required-for-focus"
          label="Update Endpoint"
          leftSection={<IconHome2 size="1rem" stroke={1.5} />}
        />
        <NavLink
          href="#required-for-focus"
          label="Rate Limits"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
        />
        <NavLink
          href="#required-for-focus"
          label="Schema"
          leftSection={<IconCircleOff size="1rem" stroke={1.5} />}
        />
      </Box>
      <Box flex="1">
        <Title mb="lg" order={2}>
          Update Endpoint
        </Title>
        <Box mb="xl">
          <Switch
            label="Enable or Disable Endpoint"
            checked={enabled}
            onChange={handleEnable}
            disabled={subscriptionCount > 0 && enabled}
          />
        </Box>
        <Box
          mb="xl"
          w="100%"
          component="form"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <EndpointFormInput
            contracts={contracts}
            mode="update"
            form={form}
            hasSubs={subscriptionCount > 0}
          />
          <Group justify="flex-end">
            <Button type="submit" loading={loading}>
              Update
            </Button>
          </Group>
        </Box>
        <PostSchema />
      </Box>
    </Group>
  );
}
