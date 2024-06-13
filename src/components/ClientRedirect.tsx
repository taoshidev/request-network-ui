"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect } from "react";
import { Box, Center, Loader, Title } from "@mantine/core";

export default function ClientRedirect({
  href,
  message,
  delay = 0,
}: {
  href: Route;
  message?: string;
  delay?: number;
}) {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(href);
    }, delay);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);
  return (
    <Center h="100%">
      <Box className="text-center">
        {message && (
          <Title order={2} className="pb-10">
            {message}
          </Title>
        )}
        <Loader size="xl" />
      </Box>
    </Center>
  );
}
