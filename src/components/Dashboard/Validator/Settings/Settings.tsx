"use client";

import { useState, useEffect } from "react";
import { Title, Group, Box, Button, TextInput } from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconCopy } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { deleteKey, updateKey } from "@/actions/keys";
import { TAOSHI_REQUEST_KEY } from "@/constants";

import styles from "./settings.module.css";

const validatorSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
});

type Validator = z.infer<typeof validatorSchema>;

interface SettingsProps {
  user: any;
}

export function Settings({ user }: SettingsProps) {
  const supabase = createClientComponentClient();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<Validator>({
    mode: "onChange",
    resolver: zodResolver(validatorSchema),
  });

  const onUpdate: SubmitHandler<Validator> = async (values) => {
    const { data, error } = await supabase
      .from("validators")
      .update({ end_point: values.endpoint })
      .eq("id", user.id)
      .select();

    console.log(data);
  };

  useEffect(() => {
    const test = async () => {
      const { data: validators, error: GetValidatorError } = await supabase
        .from("validators")
        .select("*")
        .eq("id", user.id);
    };
  }, []);

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
            {...register("endpoint", { required: true })}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" variant="primary">
              Update Name
            </Button>
          </Group>
        </Box>
      </Box>
    </Box>
  );
}
