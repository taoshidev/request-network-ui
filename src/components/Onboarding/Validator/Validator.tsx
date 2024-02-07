"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Box,
  TextInput,
  Button,
  Title,
  Text,
  rem,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { z } from "zod";
import { useRouter } from "next/navigation";

import styles from "./validator.module.css";

const userSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
});

type User = z.infer<typeof userSchema>;

interface ValidatorProps {
  user: any;
}

export function Validator({ user }: ValidatorProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    const { error } = await supabase
      .from("validators")
      .update({ end_point: values.endpoint })
      .eq("id", user.id)
      .select();

    setLoading(false);
    if (!error) router.push("/validator/dashboard");
  };

  return (
    <Container>
      <Box my="xl">
        <Title order={3}>Add your Validator Endpoint.</Title>
        <Text>Create your first API key and start receiving requests.</Text>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Endpoint"
            placeholder="Endpoint"
            {...register("endpoint", { required: true })}
            error={errors.endpoint?.message}
          />
        </Box>

        <Box mt="lg">
          <Button type="submit" loading={loading} w="100%">
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
