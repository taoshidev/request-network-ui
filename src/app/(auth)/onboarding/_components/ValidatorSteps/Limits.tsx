"use client";

import { useState } from "react";
import { Box, Button, NumberInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { updateUser } from "@/actions/auth";
import { createSettings } from "@/actions/validators";

import "@mantine/dates/styles.css";

const settingsSchema = z.object({
  limit: z.number().int().min(1),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
});

type Settings = z.infer<typeof settingsSchema>;

export function Limits({ onComplete, user }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Settings>({
    initialValues: {
      limit: 10,
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
    },
    validate: zodResolver(settingsSchema),
  });

  const onSubmit = async (values: Settings) => {
    setLoading(true);

    try {
      await createSettings({
        id: user.id,
        limit: values.limit,
        refillRate: values.refillRate,
        refillInterval: values.refillInterval,
        remaining: values.remaining,
      });

      const { error: UpdateUserError } = await updateUser({
        data: { onboarding: { step: 3, completed: true } },
      });

      onComplete();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box mt="xl" component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
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

      <Box mb="md">
        <NumberInput
          label="Refill Interval"
          description="Determines the speed at which tokens are refilled."
          placeholder="Input placeholder"
          {...form.getInputProps("refillInterval")}
        />
      </Box>
      <Box mt="xl">
        <Button type="submit" w="100%" loading={loading}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
