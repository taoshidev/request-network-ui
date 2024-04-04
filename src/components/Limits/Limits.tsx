"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Button,
  NumberInput,
  TextInput,
  Group,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { v4 as uuid } from "uuid";
import { z } from "zod";
import { createEndpoint } from "@/actions/endpoints";
import { useNotification } from "@/hooks/use-notification";

const EndpointSchema = z.object({
  id: z.string().uuid(),
  limit: z.number().int().min(1),
  url: z.string().url(),
  subnet: z.string().uuid(),
  validator: z.string().uuid(),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
});

type Endpoint = z.infer<typeof EndpointSchema>;

export function Limits({ onComplete, user, validators, subnets }: any) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();

  const form = useForm<Endpoint>({
    name: "create-new-endpoint",
    initialValues: {
      id: uuid(),
      limit: 10,
      url: "http://localhost:3001",
      subnet: "",
      validator: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
    },
    validate: zodResolver(EndpointSchema),
  });

  const onSubmit = async (values: Endpoint) => {
    setLoading(true);

    try {
      const res = await createEndpoint(values);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message);
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Only return validated validators for selection
  const verifiedValidators = useMemo(() => {
    return validators
      .filter((v) => v.verified)
      .map((v) => {
        return {
          value: v.id,
          label: v?.account?.meta?.name || "Unknown",
        };
      });
  }, [validators]);

  const availableSubnets = useMemo(() => {
    return subnets
      .map((s) => {
        return {
          value: s.id,
          label: s.label,
        };
      });
  }, [subnets]);

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <Box mb="md">
        <TextInput
          withAsterisk
          label="URL"
          placeholder="URL"
          {...form.getInputProps("url")}
        />
      </Box>
      <Box mb="md">
        <Select
          label="Which Validator"
          placeholder="Pick value or enter anything"
          data={verifiedValidators}
          {...form.getInputProps("validator")}
        />
      </Box>
      <Box mb="md">
        <Select
          label="Which Subnet"
          placeholder="Pick value or enter anything"
          data={availableSubnets}
          {...form.getInputProps("subnet")}
        />
      </Box>
      <Box mb="md">
        <NumberInput
          label="Limit"
          description="The total amount of burstable requests."
          placeholder="Input placeholder"
          {...form.getInputProps("limit")}
        />
      </Box>
      <Group mb="md" grow>
        <Box>
          <NumberInput
            label="Refill Rate"
            description="How many tokens to refill during each refillInterval"
            placeholder="Input placeholder"
            {...form.getInputProps("refillRate")}
          />
        </Box>
        <Box>
          <NumberInput
            label="Refill Interval"
            description="Determines the speed at which tokens are refilled."
            placeholder="Input placeholder"
            {...form.getInputProps("refillInterval")}
          />
        </Box>
      </Group>

      <Box mt="xl">
        <Button type="submit" w="100%" loading={loading}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
