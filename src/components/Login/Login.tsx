"use client";

import { useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { createClient } from "@/lib/supabase/client";
import { Title, Box, Text } from "@mantine/core";
import styles from "./login.module.css";
import ClientRedirect from "@/components/ClientRedirect";

export function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const supabase = createClient();

  return loading ? (
    <ClientRedirect message="Initializing session..." />
  ) : (
    <Box className="mt-40">
      <Box className="mb-8">
        <Title className="mb-4">Login</Title>
        <Text>
          Authentication with the Request Network, simply sign in with Google or
          Github
        </Text>
      </Box>
      <Box onClick={() => setLoading(true)}>
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
    </Box>
  );
}
