"use client";

import { useState } from "react";
import dayjs from "dayjs";
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
import "@mantine/code-highlight/styles.css";
import { useForm } from "@mantine/form";
import { z } from "zod";

import { createValidator, createSettings } from "@/actions/validators";
import { isAddress } from "@/utils/address";

import styles from "./settings.module.css";

import { Schema } from "../Schema";

const settingsSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
  hotkey: z.string().refine((value) => isAddress({ address: value }), {
    message: "Invalid Bittensor address",
  }),
  limit: z.number().int().min(1),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  expires: z.date(),
});

type Settings = z.infer<typeof settingsSchema>;
interface SettingsProps {
  withSchema?: boolean;
  user: any;
  validator: any;
}
export function Settings({ withSchema, user, validator }: SettingsProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Settings>({
    initialValues: {
      endpoint: "",
      hotkey: "",
      limit: 10,
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
      expires: dayjs().add(1, "day").toDate(),
    },
    validate: zodResolver(settingsSchema),
  });

  const onSubmit = async (values: Settings) => {
    setLoading(true);

    try {
      await createValidator({
        id: user.id,
        endpoint: values.endpoint,
        hotkey: values.hotkey,
      });

      await createSettings({
        id: user.id,
        limit: values.limit,
        refillRate: values.refillRate,
        refillInterval: values.refillInterval,
        remaining: values.remaining,
        expires: dayjs(values.expires).valueOf(),
      });

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const _schema = {
    message: "Welcome to the API",
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };

  const code = `${JSON.stringify(_schema, null, 2)}`;

  return (
    <Box>
      <Box mb="xl" component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
        <Group justify="space-between" grow mb="xl">
          <Box mb="md">
            <TextInput
              withAsterisk
              label="Endpoint"
              placeholder="Endpoint"
              {...form.getInputProps("endpoint")}
            />
          </Box>
          <Box mb="md">
            <TextInput
              withAsterisk
              label="Validator Hotkey"
              placeholder="Validator Hotkey"
              {...form.getInputProps("hotkey")}
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
            Create
          </Button>
        </Box>
      </Box>
      {withSchema && <Schema />}
    </Box>
  );
}
