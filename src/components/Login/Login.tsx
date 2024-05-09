"use client";

import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/lib/supabase/client";

import { Title, Box, Text } from "@mantine/core";

import styles from "./login.module.css";

export function Login() {
  const supabase = createClient();

  return (
    <Box className="mt-40">
      <Box className="mb-8">
        <Title className="mb-4">Login</Title>
        <Text>
          Authentication with the Request Network, simply sign in with Google or Github
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
