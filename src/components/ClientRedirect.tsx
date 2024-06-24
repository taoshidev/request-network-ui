"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect } from "react";
import { Box, Center, Loader, Title } from "@mantine/core";

export default function ClientRedirect({
  href,
  back,
  message,
  delay = 0,
}: {
  href?: Route;
  back?: boolean
  message?: string;
  delay?: number;
}) {
  const router = useRouter();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (back) router.back();
      else if (href) router.push(href);
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
