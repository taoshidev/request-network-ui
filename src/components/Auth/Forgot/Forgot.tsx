"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Box,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { z } from "zod";

import { forgotPassword } from "@/actions/auth";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
});

type User = z.infer<typeof userSchema>;

export function Forgot() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);
    await forgotPassword(values.email);

    setLoading(false);
  };

  return (
    <Box py="md" pt="xl">
      {message && (
        <Alert
          withCloseButton
          variant="light"
          color="orange"
          icon={<IconInfoCircle />}
        >
          {message}
        </Alert>
      )}
      <Box my="xl">
        <Title>Reset Password.</Title>
        <Text>
          Can&apos;t access your Taoshi Account? No worries! Enter your email
          address below and we&apos;ll send you a reset link.
        </Text>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Email"
            error={errors.email?.message}
            {...register("email", { required: true })}
          />
        </Box>

        <Box mt="xl">
          <Button type="submit" loading={loading}>
            Reset Password
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
