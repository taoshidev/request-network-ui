"use client";

import Link from "next/link";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Box,
} from "@mantine/core";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

type User = z.infer<typeof userSchema>;

export function SignUp() {
  const supabase = createClientComponentClient();
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

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <Box py="md">
      <Box mb="xl">
        <Title>Sign Up.</Title>
        <Text>
          Have an account already? <Link href="/auth/sign-in">Sign In</Link>.
        </Text>
      </Box>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Email"
            placeholder="Email"
            {...register("email", { required: true })}
            error={errors.email?.message}
          />
        </Box>
        <Box mb="md">
          <PasswordInput
            withAsterisk
            label="Password"
            placeholder="Password"
            {...register("password", { required: true })}
            error={errors.password?.message}
          />
        </Box>
        <Box mt="lg">
          <Button type="submit" loading={loading}>
            Create Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
