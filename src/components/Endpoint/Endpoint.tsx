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

import styles from "./endpoint.module.css";

export const EndpointSchema = z.object({
  url: z.string().url({ message: "Endpoint must be a valid URL" }),
  limit: z.number().int().min(1),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  expires: z.date(),
});

interface EndpointProps {
  user: any;
  endpoint: any;
  validator: any;
}

export function Endpoint({ user, endpoint, validator }: EndpointProps) {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(endpoint.enabled);

  const form = useForm({
    initialValues: {
      id: endpoint.id,
      url: endpoint.url,
      subnet: endpoint.subnet,
      limit: endpoint.limit,
      refillRate: endpoint.refillRate,
      refillInterval: endpoint.refillInterval,
      remaining: endpoint.remaining,
      expires: endpoint.expires,
    },
    validate: zodResolver(EndpointSchema),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      await updateEndpoint({ id: endpoint.id, endpoint: values });

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnable = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const isEnabled = event.target.checked;

    try {
      await updateEndpoint({ id: endpoint.id, enabled: isEnabled });
    } catch (error) {
      console.log(error);
    }

    setEnabled(isEnabled);
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
              label="URL"
              withAsterisk
              placeholder="URL"
              {...form.getInputProps("url")}
            />
          </Box>
          <Box mb="md" flex="2">
            <Select
              label="Which Subnet"
              placeholder="Pick value or enter anything"
              data={[]}
              {...form.getInputProps("subnet")}
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
              {...form.getInputProps("limit")}
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
