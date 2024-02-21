"use client";

import { useState } from "react";
import {
  Box,
  Title,
  Text,
  Checkbox,
  UnstyledButton,
  Button,
} from "@mantine/core";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

import { getAuthUser, updateUser } from "@/actions/auth";

import styles from "./landing.module.css";

export function Landing() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = (type: "consumer" | "validator") => setRole(type);

  const letsGo = async () => {
    setLoading(true);
    const user = await getAuthUser();

    if (!user) return;

    if (role) {
      const { error: UpdateUserError } = await updateUser({
        data: { role, onboarded: true },
      });

      if (UpdateUserError) return;

      router.push("/dashboard");

      setLoading(false);
    }
  };

  return (
    <Box w={800}>
      <Box mb="xl">
        <Title>Plug in to Bittensor.</Title>
        <Text>Welcome to Taoshi. Come as you are.</Text>
      </Box>

      <Box mb="lg" className={styles.root}>
        <Checkbox
          classNames={{
            root: styles.checkboxWrapper,
            input: styles.checkbox,
          }}
          checked={role === "validator"}
          onChange={() => setRole("validator")}
          tabIndex={-1}
          size="md"
          aria-label="Checkbox example"
        />

        <UnstyledButton
          w="100%"
          className={styles.control}
          data-checked={role === "validator" || undefined}
          onClick={() => handleClick("validator")}
        >
          <Text className={styles.label}>as a Validator</Text>
          <Text className={styles.description}>Looking to sell your data?</Text>
        </UnstyledButton>
      </Box>

      <Box mb="lg" className={styles.root}>
        <Checkbox
          classNames={{
            root: styles.checkboxWrapper,
            input: styles.checkbox,
          }}
          checked={role === "consumer"}
          onChange={() => setRole("consumer")}
          tabIndex={-1}
          size="md"
          aria-label="Checkbox example"
        />

        <UnstyledButton
          w="100%"
          className={styles.control}
          data-checked={role === "consumer" || undefined}
          onClick={() => handleClick("consumer")}
        >
          <Text className={styles.label}>as a Client</Text>
          <Text className={styles.description}>Looking to use Bittensor.</Text>
        </UnstyledButton>
      </Box>
      <Box>
        <Button
          loading={loading}
          onClick={letsGo}
          disabled={isEmpty(role)}
          w="100%"
        >
          Let&apos;s Go
        </Button>
      </Box>
    </Box>
  );
}
