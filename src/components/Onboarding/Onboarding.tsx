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
import { isEmpty } from "lodash";
import { useRouter } from "next/navigation";

import { createValidator } from "@/actions/validators";
import { createConsumer } from "@/actions/consumer";
import { getUser, updateUser } from "@/actions/auth";

import styles from "./onboarding.module.css";

export function Onboarding() {
  const router = useRouter();
  const [checked, setChecked] = useState("");

  const handleClick = (type: "client" | "validator") => setChecked(type);

  const letsGo = async () => {
    const { data, error: GetUserError } = await getUser();

    if (!data || GetUserError) return;

    // if element is selected
    if (checked) {
      // if selected element is client
      if (checked === "client") {
        // update user type to consumer
        const { error: UpdateUserError } = await updateUser({
          data: {
            type: "consumer",
          },
        });

        if (UpdateUserError) return;

        try {
          // @ts-ignore
          await createConsumer({ id: data.user.id });
          router.push("/dashboard");
        } catch (error) {
          console.log(error);
        }
      } else if (checked === "validator") {
        // update user type to validator
        const { error: UpdateUserError } = await updateUser({
          data: { type: "validator" },
        });

        if (UpdateUserError) return;

        try {
          // @ts-ignore

          await createValidator({ id: data.user.id });
          router.push("/dashboard");
        } catch (error) {
          console.log(error);
        }
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
