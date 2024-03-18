"use client";

import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/lib/supabase/client";

import { useEffect } from "react";
import { Title, Box, Text } from "@mantine/core";

import styles from "./login.module.css";

export function Login() {
  const router = useRouter();

  const supabase = createClient();

  // useEffect(() => {
  //   supabase.auth.onAuthStateChange((_, session) => {
  //     if (session) {
  //       router.push("/");
  //     }
  //   });
  // }, [router, supabase.auth]);

  return (
    <Box py="md" pt="xl">
      <Box mb="xl">
        <Title mb="sm">Login</Title>
        <Text>
          Dolor velit cillum occaecat velit deserunt velit irure deserunt
          incididunt ad nisi anim. Nulla quis pariatur id esse officia veniam.
        </Text>
      </Box>

      <Auth
        redirectTo={`${process.env.NEXT_PUBLIC_DOMAIN}/callback`}
        supabaseClient={supabase}
        onlyThirdPartyProviders
        appearance={{
          extend: false,
          className: {
            anchor: styles.anchor,
            button: styles.button,
            container: styles.container,
            input: styles.input,
            label: styles.label,
            message: styles.message,
          },
        }}
        providers={["google", "github"]}
      />
    </Box>
  );
}
