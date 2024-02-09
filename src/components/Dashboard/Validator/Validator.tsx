"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Title,
  Tabs,
  rem,
  Box,
  Text,
  TextInput,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings, IconGraph } from "@tabler/icons-react";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { isEmpty } from "lodash";

import { updateValidator } from "@/actions/validators";

import { Settings } from "./Settings";

import styles from "./validator.module.css";

interface ValidatorProps {
  user: any;
  validator: any;
}

const userSchema = z.object({
  endpoint: z.string().url({ message: "Endpoint must be a valid URL" }),
});

type User = z.infer<typeof userSchema>;

export function Validator({ user, validator }: ValidatorProps) {
  const iconStyle = { width: rem(12), height: rem(12) };
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("activeTab");

  console.log(validator);

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    try {
      await updateValidator({ id: user.id, endpoint: values.endpoint });
      setLoading(false);
      router.push("/dashboard");
    } catch (error) {}
  };

  return (
    <Container>
      {!validator[0].endpoint ? (
        <>
          <Box my="xl">
            <Title order={3}>Add your first Validator Endpoint.</Title>
            <Text>Create your first API key and start receiving requests.</Text>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
            <Box mb="md">
              <TextInput
                withAsterisk
                label="Endpoint"
                placeholder="Endpoint"
                {...register("endpoint", { required: true })}
                error={errors.endpoint?.message}
              />
            </Box>

            <Box mt="lg">
              <Button type="submit" loading={loading} w="100%">
                Create
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Title my="xl">Validator Settings</Title>
          <Tabs
            value={activeTab || "settings"}
            onChange={(value) => router.push(`/dashboard?activeTab=${value}`)}
            defaultValue="statistics"
          >
            <Tabs.List>
              <Tabs.Tab
                value="statistics"
                leftSection={<IconGraph style={iconStyle} />}
              >
                Statistics
              </Tabs.Tab>
              <Tabs.Tab
                value="settings"
                leftSection={<IconSettings style={iconStyle} />}
              >
                Settings
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="statistics">Messages tab content</Tabs.Panel>

            <Tabs.Panel value="settings">
              <Settings user={user} validator={validator} />
            </Tabs.Panel>
          </Tabs>
        </>
      )}
    </Container>
  );
}
