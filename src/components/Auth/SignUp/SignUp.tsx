"use client";

import Link from "next/link";
import { useState } from "react";
import { login, signup } from "@/actions/auth";
import {
  Title,
  TextInput,
  PasswordInput,
  Button,
  Text,
  Box,
  Anchor,
  Checkbox,
  Dialog,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
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
  const [loading, setLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    await signup(values);
    setLoading(false);

    open();
  };

  return (
    <>
      <Dialog opened={opened} withCloseButton onClose={close} radius="0">
        <Text size="sm">
          We have sent a confirmation email to your email address. Please follow
          the instructions in the email to complete your signup.
        </Text>
      </Dialog>

      <Box py="md" pt="xl">
        <Box my="xl">
          <Title>Sign Up.</Title>
          <Text>
            Have an account already?{" "}
            <Anchor component={Link} href="/auth/login">
              Sign In
            </Anchor>
            .
          </Text>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
          <Box mb="lg">
            <TextInput
              withAsterisk
              label="Email"
              placeholder="Email"
              {...register("email", { required: true })}
              error={errors.email?.message}
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
          <Box mb="xl">
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
                  </Anchor>{" "}
                </Text>
              }
            />
          </Box>
          <Box>
            <Text size="xs">
              We collect your name and email address in order to allow you
              access to your account, to manage your account and to contact you
              about changes to your account. We also collect your IP address and
              share it with SEON for fraud prevention purposes. For more
              information in relation to our privacy practices, please see our{" "}
              <Anchor component={Link} href="/">
                Privacy Policy
              </Anchor>
            </Text>
          </Box>
          <Box mt="xl">
            <Button type="submit" loading={loading}>
              Create Account
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
