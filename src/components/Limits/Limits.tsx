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
import { isEmpty } from "lodash";

import { updateUser } from "@/actions/auth";
import { createEndpoint } from "@/actions/endpoints";

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

export function Limits({ onComplete, user, validators }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Endpoint>({
    initialValues: {
      id: uuid(),
      limit: 10,
      url: "http://localhost:3001",
      subnet: "",
      validator: "b83cc56b-0df3-49b8-b1a7-c4f2fd939324",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
    },
    validate: zodResolver(EndpointSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      await createEndpoint(values);

      await updateUser({
        data: { onboarding: { step: 3, completed: true } },
      });

      onComplete();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const availableSubnets = useMemo(() => {
    return validators.map((validator) => validator.subnets);
  }, [validators]);

  console.log(availableSubnets);

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
