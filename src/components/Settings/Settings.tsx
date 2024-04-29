"use client";

import { useState, Fragment } from "react";
import dayjs from "dayjs";
import {
  Title,
  Text,
  Group,
  Box,
  Button,
  TextInput,
  Modal,
  Alert,
  CopyButton,
  Table,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconCopy } from "@tabler/icons-react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deleteKey, updateKey } from "@/actions/keys";
import { TAOSHI_REQUEST_KEY } from "@/constants";
import styles from "./settings.module.css";
import { useNotification } from "@/hooks/use-notification";
import { StatTable } from "../StatTable";

const updateSchema = z.object({
  name: z
    .string()
    .regex(/^[^\s]*$/, { message: "Spaces are not allowed" })
    .min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof updateSchema>;

export function Settings({ apiKey }: { apiKey: any }) {
  const [opened, { open, close }] = useDisclosure(false);
  const { notifySuccess, notifyError } = useNotification();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [key]: Array<any> = useLocalStorage({
    key: TAOSHI_REQUEST_KEY,
  });

  const {
    register,
    handleSubmit: handleUpdateKey,
    formState: { isValid, errors },
  } = useForm<User>({
    mode: "onChange",
    resolver: zodResolver(updateSchema),
  });

  const handleDeleteKey = async () => {
    setLoading(true);
    const res = await deleteKey({ keyId: apiKey.id });
    if (res?.status !== 204) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
    setLoading(false);

    router.push("/dashboard");
  };

  const onUpdateKey: SubmitHandler<User> = async (values) => {
    setLoading(true);
    const res = await updateKey({
      keyId: apiKey.id,
      params: { name: values.name },
    });
    if (res?.status !== 200) return notifyError(res?.message as string);
    notifySuccess(res?.message as string);
    setLoading(false);
  };

  const handleCopy = (copy: () => void) => {
    localStorage.removeItem(TAOSHI_REQUEST_KEY);
    copy();
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Are you sure you want to delete API Key?"
      >
        <Box mb="lg">
          Deleting will remove access to Taoshi for this project immediately.
          This cannot be undone.
        </Box>
        <Box>
          <Button w="100%" loading={loading} onClick={handleDeleteKey}>
            Yes, Delete API Key
          </Button>
        </Box>
      </Modal>

      {key && key.id && (
        <Box my="xl" py="md" className={styles["one-time"]}>
          <Box mb="lg">
            <Title mb="md" order={2}>
              Authentication Key
            </Title>

            <Alert
              color="orange"
              radius="0"
              title=""
              icon={<IconAlertCircle />}
            >
              <Text size="sm">
                Please copy and safely store your unique, one-time
                authentication key below.
              </Text>
              This key will not be displayed again.
            </Alert>
          </Box>

          <Group gap="xs">
            <Text>Authentication Key:</Text>
            <CopyButton value={key.id}>
              {({ copied, copy }) => (
                <Button
                  leftSection={<IconCopy size={14} />}
                  variant="subtle"
                  onClick={() => handleCopy(copy)}
                >
                  <Text fw="bold">{copied ? "Copied key" : key.id}</Text>
                </Button>
              )}
            </CopyButton>
          </Group>
        </Box>
      )}

      <Box my="xl">
        <Title order={2} mb="sm">
          General Settings
        </Title>

        <Box component="form" onSubmit={handleUpdateKey(onUpdateKey)} w="100%">
          <TextInput
            label="Edit Key Name"
            defaultValue={apiKey.name}
            placeholder={apiKey.name}
            error={errors.name?.message}
            {...register("name", { required: true })}
          />

          <Group justify="flex-end" mt="xl">
            <Button type="submit" variant="primary">
              Update Name
            </Button>
          </Group>
        </Box>
      </Box>
      <StatTable data={apiKey} />

      {/* <Box my="xl">
          <Title order={2}>Requirements</Title>
        </Box> */}

      <Box my="xl">
        <Alert
          variant="light"
          color="orange"
          title="Delete Key"
          icon={<IconAlertCircle />}
        >
          <Box>
            <Box>
              Any applications using this project&apos;s keys will no longer be
              able to access the Taoshi&apos;s API.
            </Box>
            <Group justify="flex-end" mt="lg">
              <Button variant="orange" onClick={open}>
                Delete Key
              </Button>
            </Group>
          </Box>
        </Alert>
      </Box>
    </>
  );
}
