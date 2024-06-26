"use client";

import { useState } from "react";
import {
  Box,
  Title,
  Text,
  Checkbox,
  UnstyledButton,
  Button,
  Center,
  Container,
} from "@mantine/core";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { getAuthUser, updateUser } from "@/actions/auth";

import styles from "./onboarding.module.css";
import { NOTIFICATION_TYPE } from "@/hooks/use-notification";
import { sendNotification } from "@/actions/notifications";

export function Onboarding() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (type: "consumer" | "validator") => setRole(type);

  const letsGo = async () => {
    setLoading(true);
    const user = await getAuthUser();

    if (role) {
      const saveUser = {
        data: { role, onboarded: true, agreed_to_tos: false },
      };

      if (role === "validator") {
        Object.assign(saveUser.data, {
          stripe_enabled: true,
          paypal_enabled: true,
          crpyto_enabled: false,
        });
      }

      const { error: UpdateUserError } = await updateUser(saveUser);

      if (UpdateUserError) return;

      // send welcome to request network email
      sendNotification({
        type: NOTIFICATION_TYPE.SUCCESS,
        subject: "Welcome to Request Network!",
        content: `${
          role === "consumer"
            ? "Your consumer account has been created."
            : "Your validator account has been created."
        }`,
        fromUserId: user?.id,
        userNotifications: [user],
      });

      // if user is a validator, redirect to dashboard, else redirect to registration
      if (role === "consumer") {
        router.push("/registration");
      } else {
        router.push("/dashboard");
      }

      setLoading(false);
    }
  };

  return (
    <Container className="h-screen">
      <Center className="my-32">
        <Box className="w-8/12">
          <Box className="mb-8">
            <Title>Plug in to Bittensor.</Title>
            <Text>Welcome to Taoshi. Come as you are.</Text>
          </Box>

          <Box className="relative mb-4">
            <Checkbox
              size="md"
              classNames={{
                root: "absolute pointer-events-none top-4 left-4",
                input: styles.checkbox,
              }}
              checked={role === "validator"}
              onChange={() => setRole("validator")}
              tabIndex={-1}
              aria-label="Checkbox example"
            />

            <UnstyledButton
              className={clsx(
                "w-full shadow-sm border border-gray-200 bg-white p-4 pl-14 transition-colors duration-100 ease-in-out",
                styles.control
              )}
              data-checked={role === "validator" || undefined}
              onClick={() => handleClick("validator")}
            >
              <Text className="font-bold leading-none">as a Validator</Text>
              <Text className="mt-1 text-xs">Looking to use Bittensor.</Text>
            </UnstyledButton>
          </Box>

          <Box className="relative mb-4">
            <Checkbox
              size="md"
              classNames={{
                root: "absolute pointer-events-none top-4 left-4",
                input: styles.checkbox,
              }}
              checked={role === "consumer"}
              onChange={() => setRole("consumer")}
              tabIndex={-1}
              aria-label="Checkbox example"
            />

            <UnstyledButton
              className={clsx(
                "w-full shadow-sm border border-gray-200 bg-white p-4 pl-14",
                styles.control
              )}
              data-checked={role === "consumer" || undefined}
              onClick={() => handleClick("consumer")}
            >
              <Text className="font-bold leading-none">as a Consumer</Text>
              <Text className="mt-1 text-xs">Looking to use Bittensor.</Text>
            </UnstyledButton>
          </Box>
          <Box>
            <Button
              className="w-full"
              loading={loading}
              onClick={letsGo}
              disabled={isEmpty(role)}
            >
              Let&apos;s Go
            </Button>
          </Box>
        </Box>
      </Center>
    </Container>
  );
}
