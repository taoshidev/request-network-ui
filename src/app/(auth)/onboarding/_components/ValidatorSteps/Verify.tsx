"use client";

import { useState } from "react";
import { Box, Button, Text } from "@mantine/core";

import { createValidator } from "@/actions/validators";
import { updateUser } from "@/actions/auth";

const wait = (waitTime = 1000, response = "Success!") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(response);
    }, waitTime);
  });
};

export function Verify({ onComplete, user }: any) {
  const [loading, setLoading] = useState(false);

  // mock verification
  const handleVerification = async () => {
    setLoading(true);

    await wait(2000);

    const { error: UpdateUserError } = await updateUser({
      data: { onboarding: { step: 2 } },
    });

    onComplete();
    setLoading(false);
  };

  return (
    <Box mt="xl" w="100%">
      <Text>
        Incididunt ipsum reprehenderit minim ad consequat occaecat esse cillum.
      </Text>
      <Box mt="lg">
        <Button w="100%" onClick={handleVerification} loading={loading}>
          Verify
        </Button>
      </Box>
    </Box>
  );
}
