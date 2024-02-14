"use client";

import { useState } from "react";
import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { isAddress } from "@/utils/address";

import { updateUser } from "@/actions/auth";
import { createValidator } from "@/actions/validators";

const settingsSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
  hotkey: z.string().refine((value) => isAddress({ address: value }), {
    message: "Invalid Bittensor address",
  }),
});

type Settings = z.infer<typeof settingsSchema>;

export function Create({ onComplete, user }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Settings>({
    initialValues: {
      endpoint: "",
      hotkey: "",
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

      const { error: UpdateUserError } = await updateUser({
        data: { onboarding: { step: 1 } },
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
      <Box mt="lg">
        <Button type="submit" w="100%" loading={loading}>
          Create
        </Button>
      </Box>
    </Box>
  );
}
