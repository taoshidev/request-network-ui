"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { Box, Loader, Title } from "@mantine/core";

export default function ClientRedirect({
  href,
  back,
  message,
  delay = 0,
}: {
  href?: Route;
  back?: boolean;
  message?: string;
  delay?: number;
}) {
  const [showLoader, setShowLoader] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loaderTimer = setTimeout(() => {
        setShowLoader(true);
        document.body.style.overflow = "hidden";
      }, 0);

      const navigateTimer = setTimeout(() => {
        if (back) router.back();
        else if (href) router.push(href);
      }, delay);

      return () => {
        clearTimeout(loaderTimer);
        clearTimeout(navigateTimer);
        document.body.style.overflow = "";
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  return (
    <>
      {showLoader && (
        <Box className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
          <Box className="absolute inset-0 bg-black bg-opacity-10 backdrop-blur-sm"></Box>
          <Box className="relative text-center">
            {message && (
              <Title className="pb-10 text-black text-base">{message}</Title>
            )}
            <Loader size="lg" />
          </Box>
        </Box>
      )}
    </>
  );
}
