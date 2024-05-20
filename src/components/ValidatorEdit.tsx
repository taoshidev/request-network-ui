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
import { updateValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { useDisclosure } from "@mantine/hooks";
import { useNotification } from "@/hooks/use-notification";
import { useRouter } from "next/navigation";
import { TextEditor } from "@/components/TextEditor";
import { Contracts } from "@/components/Contracts";
import { UserType } from "@/db/types/user";
import { ContractType } from "@/db/types/contract";
import Services from "./Services";
import { ServiceType } from "@/db/types/service";

export const ValidatorEditSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z
    .string()
    .min(64, { message: "Description must be at least 64 characters" }),
});

export function ValidatorEdit({
  validator,
  contracts,
  services,
  user,
}: {
  validator: ValidatorType;
  contracts: ContractType[];
  services: ServiceType[];
  user: UserType;
}) {
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [activeSection, setActiveSection] = useState("edit");
  const [opened, { open, close }] = useDisclosure(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const router = useRouter();

  const form = useForm<Partial<ValidatorType>>({
    initialValues: {
      name: validator?.name || "",
      description: validator?.description || "",
    },
    validate: zodResolver(ValidatorEditSchema),
  });

  const onSubmit = async (
    values: Pick<ValidatorType, "name" | "description">
  ) => {
    setLoading(true);
    try {
      const res = await updateValidator({ id: validator.id, ...values });
      if (res?.error) return notifyError(res?.message);
      notifySuccess(res?.message as string);
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const message = JSON.stringify({
      id: validator.id,
      userId: validator.userId,
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
      notifySuccess("Validator verification successful");
      setTimeout(() => router.back(), 1000);
    } else {
      notifyError("Validator verification failed");
    }
  };

  useEffect(() => {
    const getSignature = async () => {
      const { id, userId, signature } = validator;
      const account = validator?.account;

      if (!account) return;

      const message = JSON.stringify({
        id,
        userId,
      });

      const isValid = await isValidSignature(
        message,
        signature as `0x${string}`,
        account?.address
      );

      setVerified(isValid);
    };

    getSignature();

    if (!validator?.verified) {
      getSignature();
    }
  }, [validator]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  console.log("from contracts:::::", contracts)
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
          active={activeSection === "edit"}
          label="Edit"
          leftSection={<IconCircleCheck size="1rem" stroke={1.5} />}
          onClick={() => handleSectionChange("edit")}
        />
        <NavLink
          active={activeSection === "contracts"}
          label="Contracts"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
          onClick={() => handleSectionChange("contracts")}
        />
        <NavLink
          active={activeSection === "services"}
          label="Services"
          leftSection={<IconCircleOff size="1rem" stroke={1.5} />}
          onClick={() => handleSectionChange("services")}
        />
      </Box>
      <Box flex="1">
        {!validator.verified && (
          <Alert
            className="shadow-sm"
            mb="xl"
            color="orange"
            radius="0"
            title="Verify your Validator"
            icon={<IconAlertCircle />}
          >
            <Text mb="md" size="sm">
              Your validator has not been verified yet. Please verify your
              validator so that customers can connect to your service.
            </Text>
            <Button onClick={handleVerify} variant="light">
              Verify
            </Button>
          </Alert>
        )}
        {activeSection === "edit" && (
          <>
            <Title mb="lg" order={2}>
              Edit Validator
            </Title>
            <Box
              mb="lg"
              w="100%"
              component="form"
              onSubmit={form.onSubmit(onSubmit)}
            >
              <Box mb="md">
                <TextInput
                  mb="md"
                  withAsterisk
                  label="Validator Name"
                  placeholder="Enter a name for your validator"
                  {...form.getInputProps("name")}
                />
                <TextEditor<ValidatorType>
                  type="BubbleEditor"
                  editable={true}
                  prop="description"
                  form={form}
                  placeholder="Enter validator description."
                  label={{ text: "Description", required: true }}
                />
              </Box>
              <Box mb="md">
                <Button type="submit" loading={loading} className="float-right">
                  Update
                </Button>
              </Box>
            </Box>
          </>
        )}
        {activeSection === "contracts" && (
          <Contracts contracts={contracts} user={user} />
        )}
        {activeSection === "services" && (
          <Services services={services} user={user} />
        )}
      </Box>
    </Group>
  );
}
