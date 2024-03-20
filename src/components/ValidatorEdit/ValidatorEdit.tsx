"use client";

import { useState, useEffect } from "react";
import {
  Alert,
  NavLink,
  Group,
  Box,
  Title,
  Button,
  TextInput,
  Text,
  Modal,
  List,
  Anchor,
  Space,
} from "@mantine/core";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { z } from "zod";
import {
  IconGauge,
  IconAlertCircle,
  IconCircleOff,
  IconCircleCheck,
} from "@tabler/icons-react";

import { sign, isValidSignature, SignedDataType } from "@/lib/polkadot";

import {
  updateValidator,
  ValidatorType,
  AccountType,
} from "@/actions/validators";

import { useDisclosure } from "@mantine/hooks";

export const ValidatorEditSchema = z.object({
  url: z.string().url({ message: "Endpoint must be a valid URL" }),
});

export function ValidatorEdit({ validator }: { validator: ValidatorType }) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      id: validator.id,
      url: "",
    },
    validate: zodResolver(ValidatorEditSchema),
  });

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerify = async () => {
    const message = JSON.stringify({
      id: validator.id,
      userId: validator.userId,
      subnetId: validator.subnetId,
    });

    const signedData: Partial<SignedDataType> = await sign(message);
    if (signedData?.error) {
      open();
    } else if (signedData && "signature" in signedData) {
      const { signature, account } = signedData;

      await updateValidator({
        id: validator.id,
        signature,
        account,
        verified: true,
      });
    } else {
      console.error("Signing failed or signature is missing");
    }
  };

  useEffect(() => {
    const getSignature = async () => {
      const { id, userId, subnetId, signature } = validator;
      const account = validator?.account as AccountType;
      const message = JSON.stringify({
        id,
        userId,
        subnetId,
      });

      const isValid = await isValidSignature(
        message,
        signature,
        account.address
      );

      setVerified(isValid);
    };

    getSignature();

    if (!validator.verified) {
      getSignature();
    }
  }, [validator]);

  return (
    <Group align="flex-start">
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Validator Verification Failed"
      >
        <Box mb="lg">
          <Text size="sm">
            Validator verification failed. In order to verify your validator, a
            browser wallet that works with Bittensor is required.
          </Text>
          <Space h="sm" />
          <Text size="sm">Some browser wallets that work with Bittesnor:</Text>
          <Space h="sm" />
          <List>
            <List.Item>
              <Anchor href="https://polkadot.js.org/extension/" target="_blank">
                Polkadot-js
              </Anchor>
            </List.Item>
            <List.Item>
              <Anchor href="https://www.talisman.xyz/" target="_blank">
                talisman.xyz
              </Anchor>
            </List.Item>
          </List>
        </Box>
      </Modal>
      <Box>
        <NavLink
          active
          href="#required-for-focus"
          label="Verify"
          leftSection={<IconCircleCheck size="1rem" stroke={1.5} />}
        />
        <NavLink
          href="#required-for-focus"
          label="With right section"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
        />
        <NavLink
          href="#required-for-focus"
          label="Disabled"
          leftSection={<IconCircleOff size="1rem" stroke={1.5} />}
        />
      </Box>
      <Box flex="1">
        {!validator.verified && (
          <Alert
            mb="xl"
            color="orange"
            radius="0"
            title="Verify your Validator"
            icon={<IconAlertCircle />}
          >
            <Text mb="md" size="sm">
              Nisi ex et do cillum. Proident ullamco eiusmod fugiat nulla
              occaecat ullamco ex cillum aute officia dolor irure.
            </Text>
            <Button onClick={handleVerify} variant="white">
              Verify
            </Button>
          </Alert>
        )}
        <Title mb="lg" order={2}>
          Edit your Validator
        </Title>
        <Box
          mb="lg"
          w="100%"
          component="form"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <Box mb="md">
            <TextInput
              withAsterisk
              label="URL"
              placeholder="URL"
              {...form.getInputProps("url")}
            />
          </Box>
          <Box mb="md">
            <Button type="submit" loading={loading} w="100%">
              Update
            </Button>
          </Box>
        </Box>
      </Box>
    </Group>
  );
}
