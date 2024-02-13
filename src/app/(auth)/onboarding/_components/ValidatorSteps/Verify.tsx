"use client";

import { useState } from "react";
import { Box, Button, Text } from "@mantine/core";

import { createValidator } from "@/actions/validators";

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

    setLoading(false);

    onComplete();
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
