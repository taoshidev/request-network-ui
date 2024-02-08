"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Checkbox,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconInfoCircle } from "@tabler/icons-react";
import { z } from "zod";

import { login } from "@/actions/auth";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type User = z.infer<typeof userSchema>;

export function Login() {
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
    await login(values);

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
        <Title>Sign In.</Title>
        <Text>
          Have an account already?{" "}
          <Anchor component={Link} href="/auth/signup">
            Sign Up
          </Anchor>
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

        <Box mb="xl">
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Password"
            {...register("password", { required: true })}
            error={errors.password?.message}
          />
        </Box>

        <Group justify="space-between">
          <Box>
            <Checkbox
              color="orange"
              variant="outline"
              label={
                <Text size="xs">
                  By signing up, you confirm you have read and agree to our{" "}
                  <Anchor href="/" target="_blank" inherit>
                    Terms of Use
                  </Anchor>{" "}
                  and{" "}
                  <Anchor href="/" target="_blank" inherit>
                    Privacy Policy
                  </Anchor>
                </Text>
              }
            />
          </Box>
        </Group>

        <Group mt="xl" justify="space-between">
          <Button type="submit" loading={loading}>
            Sign In
          </Button>
          <Anchor component={Link} href="/auth/signup" target="_blank">
            Forgot Password
          </Anchor>
        </Group>
      </Box>
    </Box>
  );
}
