"use client";

import { Box, Group, TextInput } from "@mantine/core";
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

export function Create() {
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
    </Box>
  );
}
