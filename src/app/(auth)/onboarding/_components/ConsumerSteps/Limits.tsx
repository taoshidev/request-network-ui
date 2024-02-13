"use client";

import { Box, Group, NumberInput } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { isAddress } from "@/utils/address";

const settingsSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
  hotkey: z.string().refine((value) => isAddress({ address: value }), {
    message: "Invalid Bittensor address",
  }),
});

type Settings = z.infer<typeof settingsSchema>;

export function Limits() {
  const form = useForm<Settings>({
    initialValues: {
      endpoint: "",
      hotkey: "",
    },
    validate: zodResolver(settingsSchema),
  });

  return (
    <Box>
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
    </Box>
  );
}
