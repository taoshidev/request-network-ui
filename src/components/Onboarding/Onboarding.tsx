"use client";

import { useState } from "react";
import {
  Container,
  Center,
  Box,
  Title,
  Text,
  Checkbox,
  UnstyledButton,
  Button,
} from "@mantine/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import styles from "./onboarding.module.css";
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

export function Onboarding() {
  const router = useRouter();
  const [checked, setChecked] = useState("");
  const supabase = createClientComponentClient();

  const handleClick = (type: "client" | "validator") => setChecked(type);

  const letsGo = async () => {
    const { data, error: GetUserError } = await supabase.auth.getUser();

    // if element is selected
    if (checked) {
      // if selected element is client
      if (checked === "client" && !GetUserError) {
        // update user type to consumer
        const { data, error: UpdateUserError } = await supabase.auth.updateUser(
          {
            data: {
              type: "consumer",
            },
          }
        );

        if (UpdateUserError) return;

        const { error } = await supabase
          .from("consumers")
          .insert([{ id: data.user.id }])
          .select();

        if (!error) router.push("/dashboard");
      } else if (checked === "validator" && !GetUserError) {
        // update user type to validator
        const { data, error: UpdateUserError } = await supabase.auth.updateUser(
          {
            data: { type: "validator" },
          }
        );

        if (UpdateUserError) return;

        const { error } = await supabase
          .from("validators")
          .insert([{ id: data.user.id }])
          .select();

        if (!error) router.push("/onboarding/validator");
      }
    }
  };

  return (
    <Container h="100%">
      <Center h="100%">
        <Box w="500px">
          <Box mb="lg">
            <Title>Plug in to Bittensor.</Title>
            <Text>Welcome to Taoshi. Come as you are.</Text>
          </Box>

          <Box mb="lg" className={styles.root}>
            <Checkbox
              classNames={{
                root: styles.checkboxWrapper,
                input: styles.checkbox,
              }}
              checked={checked === "validator"}
              onChange={() => setChecked("validator")}
              tabIndex={-1}
              size="md"
              aria-label="Checkbox example"
            />

            <UnstyledButton
              w="100%"
              className={styles.control}
              data-checked={checked === "validator" || undefined}
              onClick={() => handleClick("validator")}
            >
              <Text className={styles.label}>as a Validator</Text>
              <Text className={styles.description}>
                Looking to sell your data?
              </Text>
            </UnstyledButton>
          </Box>

          <Box mb="lg" className={styles.root}>
            <Checkbox
              classNames={{
                root: styles.checkboxWrapper,
                input: styles.checkbox,
              }}
              checked={checked === "client"}
              onChange={() => setChecked("client")}
              tabIndex={-1}
              size="md"
              aria-label="Checkbox example"
            />

            <UnstyledButton
              w="100%"
              className={styles.control}
              data-checked={checked === "client" || undefined}
              onClick={() => handleClick("client")}
            >
              <Text className={styles.label}>as a Client</Text>
              <Text className={styles.description}>
                Looking to use Bittensor.
              </Text>
            </UnstyledButton>
          </Box>
          <Box>
            <Button onClick={letsGo} disabled={isEmpty(checked)} w="100%">
              Let&apos;s Go
            </Button>
          </Box>
        </Box>
      </Center>
    </Container>
  );
}
