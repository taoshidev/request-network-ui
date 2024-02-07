"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
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
} from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type User = z.infer<typeof userSchema>;

export function SignIn() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (!error) {
      router.push("/dashboard");
    }
  };

  return (
    <Box py="md" pt="xl">
      <Box my="xl">
        <Title>Sign In.</Title>
        <Text>
          Have an account already?{" "}
          <Anchor component={Link} href="/auth/sign-up">
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
          <Anchor component={Link} href="/auth/sign-up" target="_blank">
            Forgot Password
          </Anchor>
        </Group>
      </Box>
    </Box>
  );
}
