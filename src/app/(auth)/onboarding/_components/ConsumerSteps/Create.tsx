"use client";

import { useState, useEffect } from "react";
import { Box, Button, TextInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";

import { createKey } from "@/actions/keys";
import { getValidators, getSettings } from "@/actions/validators";

import { TAOSHI_REQUEST_KEY } from "@/constants";

import { generateShortId } from "@/utils/ids";

const keySchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

type Settings = z.infer<typeof keySchema>;

export function Create({ user, onComplete }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Settings>({
    initialValues: {
      name: "",
    },
    validate: zodResolver(keySchema),
  });

  const [_, setLocalStorage]: Array<any> = useLocalStorage({
    key: TAOSHI_REQUEST_KEY,
    defaultValue: "",
  });

  const onSubmit = async (values: Settings) => {
    setLoading(true);
    const settings = await getSettings();
    console.log(settings);

    // get a random validator
    // in the future, we will select validator based on criteria
    const validators = await getValidators();

    if (!validators || validators.length === 0) {
      setLoading(false);
      return;
    }

    // create id from user and validator
    const shortId = generateShortId(user.id, validators[0].id);

    // create key tied to user and validator
    const { result, error: CreateKeyError } = await createKey({
      name: values.name,
      ownerId: user.id,
      meta: {
        shortId,
        type: "consumer",
        validatorId: validators[0].id,
        customEndpoint: validators[0].endpoint,
      },
    });

    if (CreateKeyError) return;

    setLoading(false);
    onComplete();
    setLocalStorage({ id: result?.key });
  };

  return (
    <Box component="form" onSubmit={form.onSubmit(onSubmit)} w="100%">
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Name"
          {...form.getInputProps("name")}
        />
      </Box>

      <Box mt="lg">
        <Button type="submit" loading={loading} w="100%">
          Create
        </Button>
      </Box>
    </Box>
  );
}
