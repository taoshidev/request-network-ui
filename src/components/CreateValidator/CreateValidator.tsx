"use client";

import { useState } from "react";
import { Box, Button, TextInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { isAddress } from "@/utils/address";

import { createValidator } from "@/actions/validators";

const ValidatorSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  hotkey: z.string().refine((value) => isAddress({ address: value }), {
    message: "Invalid Bittensor address",
  }),
  subnetId: z.string().uuid(),
});

type Validator = z.infer<typeof ValidatorSchema>;

export function CreateValidator({ onComplete, user, subnets }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Validator>({
    initialValues: {
      id: uuid(),
      userId: user.id,
      hotkey: "",
      subnetId: "",
    },
    validate: zodResolver(ValidatorSchema),
  });

  const onSubmit = async (values: Validator) => {
    setLoading(true);
    console.log(values);
    try {
      await createValidator(values);

      onComplete();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Hotkey"
          placeholder="Hotkey"
          {...form.getInputProps("hotkey")}
        />
      </Box>
      <Box mb="md">
        <Select
          label="Which Subnet"
          placeholder="Pick value or enter anything"
          data={subnets}
          {...form.getInputProps("subnetId")}
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
