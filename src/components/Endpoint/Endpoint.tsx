"use client";

import { useState } from "react";
import {
  Title,
  Group,
  Box,
  Button,
  TextInput,
  NumberInput,
  Switch,
  NavLink,
  Select,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { z } from "zod";
import {
  IconHome2,
  IconGauge,
  IconChevronRight,
  IconActivity,
  IconCircleOff,
} from "@tabler/icons-react";
import { updateEndpoint } from "@/actions/endpoints";
import { PostSchema } from "../PostSchema";
import { useNotification } from "@/hooks/use-notification";
import { useRouter } from "next/navigation";

export const EndpointSchema = z.object({
  url: z.string().min(1),
  limit: z.number().int().min(1),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  expires: z.date(),
});

export function Endpoint({
  user,
  endpoint,
  validator,
}: {
  user?: any;
  endpoint: any;
  validator?: any;
}) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(endpoint.enabled);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      ...endpoint,
    },
    validate: zodResolver(EndpointSchema),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);
    const { id } = endpoint;
    try {
      const res = await updateEndpoint({ id, ...values });
      if (res?.error) return notifyError(res?.message);
      notifySuccess(res.message);
      router.refresh();
      router.back();
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
      notifySuccess(res.message);
      router.refresh();
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setEnabled(isEnabled);
    }
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
          />
        </Box>
        <Box
          mb="xl"
          w="100%"
          component="form"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <Box mb="md" flex="2">
            <TextInput
              label="Endpoint Path"
              withAsterisk
              placeholder="/api/v1/my-resource-endpoint"
              {...form.getInputProps("url")}
            />
          </Box>
          <Group justify="flex-end">
            <Button type="submit" loading={loading}>
              Update
            </Button>
          </Group>
          <Title mb="xs" order={3}>
            Rate Limits.
          </Title>
          <Box mb="md" flex="2">
            <NumberInput
              label="Limit"
              description="The total amount of burstable requests."
              placeholder="Input placeholder"
              defaultValue={10}
              {...form.getInputProps("limit")}
            />
          </Box>
          <Box mb="md">
            <NumberInput
              label="Refill Rate"
              description="How many tokens to refill during each refillInterval"
              placeholder="Input placeholder"
              defaultValue={1}
              {...form.getInputProps("refillRate")}
            />
          </Box>
          <Box mb="md">
            <DateTimePicker
              label="Expiry Date"
              description="When should your keys expire?"
              withSeconds
              placeholder="Pick date"
              {...form.getInputProps("expires")}
            />
          </Box>
          <Box mb="md" flex="2">
            <NumberInput
              label="Refill Interval"
              description="Determines the speed at which tokens are refilled."
              placeholder="Input placeholder"
              defaultValue={1}
              {...form.getInputProps("refillInterval")}
            />
          </Box>
        </Box>

        <Group justify="flex-end">
          <Button type="submit" loading={loading}>
            Update
          </Button>
        </Group>

        <PostSchema />
      </Box>
    </Group>
  );
}
