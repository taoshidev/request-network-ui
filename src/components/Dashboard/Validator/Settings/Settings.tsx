"use client";

import { Title, Group, Box, Button, TextInput } from "@mantine/core";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { updateValidator } from "@/actions/validators";

import styles from "./settings.module.css";

const validatorSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
});

type Validator = z.infer<typeof validatorSchema>;

interface SettingsProps {
  user: any;
  validator: any;
}

export function Settings({ user, validator }: SettingsProps) {
  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Validator>({
    mode: "onChange",
    resolver: zodResolver(validatorSchema),
  });

  const onUpdate: SubmitHandler<Validator> = async (values) => {
    try {
      await updateValidator({ id: user.id, endpoint: values.endpoint });
    } catch (error) {}
  };

  return (
    <Box>
      <Box my="xl">
        <Title order={2} mb="sm">
          General Settings
        </Title>

        <Box component="form" onSubmit={handleSubmit(onUpdate)} w="100%">
          <TextInput
            label="Edit Endpoint"
            placeholder="Endpoint"
            error={errors.endpoint?.message}
            defaultValue={validator[0].endpoint}
            {...register("endpoint", { required: true })}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" variant="primary">
              Update Endpoint
            </Button>
          </Group>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onUpdate)} w="100%">
          <TextInput
            label="Edit Hotkey"
            placeholder="Hotkey"
            error={errors.endpoint?.message}
            {...register("endpoint", { required: true })}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" variant="primary">
              Update Hotkey
            </Button>
          </Group>
        </Box>
      </Box>
    </Box>
  );
}
