"use client";

import { useState } from "react";
import {
  Title,
  Group,
  Box,
  Button,
  TextInput,
  NumberInput,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";

import { updateEndpoint } from "@/actions/endpoints";

import { PostSchema } from "../PostSchema";

import {
  EndpointsSchema,
  EndpointType,
} from "../../app/(routes)/endpoints/types";

import styles from "./endpoint.module.css";

interface EndpointProps {
  user: any;
  endpoint: any;
  validator: any;
}

export function Endpoint({ user, endpoint, validator }: EndpointProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    initialValues: {
      url: endpoint.url,
      limit: endpoint.limit,
      refillRate: endpoint.refillRate,
      refillInterval: endpoint.refillInterval,
      remaining: endpoint.remaining,
      expires: endpoint.expires,
    },
    validate: zodResolver(EndpointsSchema),
  });

  const onSubmit = async (values: any) => {
    setLoading(true);

    try {
      await updateEndpoint(values);

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Title order={2}>Update Endpoint</Title>

      <Box mb="xl" component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
        <Group justify="space-between" grow mb="xl">
          <Box mb="md">
            <TextInput
              withAsterisk
              label="URL"
              placeholder="URL"
              {...form.getInputProps("url")}
            />
          </Box>
        </Group>

        <Title order={2}>Rate Limits.</Title>

        <Group justify="space-between" grow>
          <Box mb="md">
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
        </Group>
        <Group justify="space-between" grow mb="xl">
          <Box mb="md">
            <DateTimePicker
              withSeconds
              label="Expiry Date"
              placeholder="Pick date"
              description="When should your keys expire?"
              {...form.getInputProps("expires")}
            />
          </Box>
          <Box mb="md">
            <NumberInput
              label="Refill Interval"
              description="Determines the speed at which tokens are refilled."
              placeholder="Input placeholder"
              {...form.getInputProps("refillInterval")}
            />
          </Box>
        </Group>

        <Box mt="lg">
          <Button type="submit" loading={loading} w="100%">
            Update
          </Button>
        </Box>
      </Box>
      <PostSchema />
    </Box>
  );
}
