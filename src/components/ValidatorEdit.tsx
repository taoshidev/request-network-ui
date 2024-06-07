"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  sign,
  isValidSignature,
  SignedDataType,
  getWeb3Accounts,
} from "@/lib/polkadot";
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
import { useModals } from "@mantine/modals";
import AccountSelector from "@components/AccountSelector";
import { isCrypto } from "@/utils/is-crypto";
import { checkForStripe } from "@/actions/payments";
import StripeSetupModal from "./StripeSetupModal";

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
  const [isCryptoService, setIsCryptoService] = useState(false);
  const [activeSection, setActiveSection] = useState("edit");
  const [opened, { open, close }] = useDisclosure(false);
  const [stripeOpened, { open: stripeOpen, close: stripeClose }] =
    useDisclosure(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const accountModalRef = useRef<string | null>(null);
  const router = useRouter();
  const modals = useModals();
  const [stripe, setStripe] = useState(null);

  const form = useForm<Partial<ValidatorType>>({
    initialValues: {
      name: validator?.name || "",
      description: validator?.description || "",
    },
    validate: zodResolver(ValidatorEditSchema),
  });

  useEffect(() => {
    const crypto = isCrypto(services);
    setIsCryptoService(crypto);
  }, [services, validator]);

  const onSubmit = async (values) => {
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

    const web3Accounts = await getWeb3Accounts();
    if (web3Accounts?.error) {
      // no extensions installed
      open();
      return;
    }
    const accounts = web3Accounts?.data;

    if (accounts?.length === 1) {
      await signAndVerify(accounts[0], message);
    } else if (accounts && Array.isArray(accounts) && accounts.length > 1) {
      accountModalRef.current = modals.openModal({
        centered: true,
        title: "Select an Account",
        children: (
          <AccountSelector
            accounts={accounts}
            onSelect={(selectedAccount) => {
              handleVerifyAccount(selectedAccount, message);
              modals.closeModal(accountModalRef?.current as string);
            }}
            onClose={() =>
              modals.closeModal(accountModalRef?.current as string)
            }
          />
        ),
      });
    }
  };

  const handleVerifyAccount = async (selectedAccount, message) => {
    await signAndVerify(selectedAccount, message);
  };

  const signAndVerify = async (selectedAccount, message) => {
    const signedData: Partial<SignedDataType> = await sign(
      message,
      selectedAccount
    );
    if (signedData?.error) {
      notifyError(signedData?.error);
      return;
    }
    if (signedData && "signature" in signedData) {
      const { signature, account } = signedData;

      if (!validator?.verified) {
        const isValid = await isValidSignature(
          message,
          signature as `0x${string}`,
          account?.address! as string,
          validator
        );

        if (typeof isValid === "object" && "error" in isValid) {
          notifyError(isValid.error as string);
          return;
        }

        if (isValid) {
          await updateValidator({
            id: validator.id,
            // signature,
            account,
            verified: true,
          });
          notifySuccess("Validator verification successful");
          setTimeout(() => router.back(), 1000);
        }
      }
    } else {
      notifyError("Validator verification failed");
    }
  };

  const handleCheckStripe = async () => {
    // TODO: we might want to add stripe_setup_completed in database
    if (!user?.user_metadata?.stripe_enabled) {
      notifyError(
        "Validator verification failed! Stripe is not enabled for your account."
      );
      return;
    }

    const stripe = await checkForStripe(validator.id as string);
    setStripe(stripe);
    stripeOpen();
  };

  const handleFiatVerify = async () => {
    if (!validator?.verified) {
      await updateValidator({
        id: validator.id,
        verified: true,
        stripeEnabled: true,
      });
      notifySuccess("Validator verification successful.");
      setTimeout(() => router.back(), 1000);
    } else {
      notifyError("Validator verification failed.");
    }
  };

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
          <Text size="sm">Some browser wallets that work with Bittensor:</Text>
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

      <StripeSetupModal
        opened={stripeOpened}
        stripe={stripe}
        onCancel={stripeClose}
        onConfirm={handleFiatVerify}
      />

      <Box>
        <NavLink
          active={activeSection === "edit"}
          label="Edit"
          leftSection={<IconCircleCheck size="1rem" stroke={1.5} />}
          onClick={() => setActiveSection("edit")}
        />
        <NavLink
          active={activeSection === "contracts"}
          label="Contracts"
          leftSection={<IconGauge size="1rem" stroke={1.5} />}
          onClick={() => setActiveSection("contracts")}
        />
        <NavLink
          active={activeSection === "services"}
          label="Services"
          leftSection={<IconCircleOff size="1rem" stroke={1.5} />}
          onClick={() => setActiveSection("services")}
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
            <Text mb="md" size="md">
              Your validator has not been verified yet. Verification is
              essential to ensure that you own the Bittensor hotkey specified
              during onboarding. This process helps us confirm your ownership by
              using your signature on a message.
            </Text>
            <Text mb="md" size="md">
              During onboarding, we captured your validator&apos;s Bittensor
              hotkey. To verify ownership, we use the Polkadot Chrome extension.
              This extension operates separately from our app and allows you to
              add your hotkey.
            </Text>
            <Text mb="md" size="md">
              The Polkadot Chrome extension will return the hotkey, and we will
              match it with the one specified during onboarding. If they match,
              your validator will be considered verified, confirming that you
              indeed own the hotkey.
            </Text>
            <Text mb="md" size="md">
              This verification process is purely for ownership validation and{" "}
              <b>DOES NOT</b> involve transferring <b>ANY</b> crypto funds.
            </Text>
            <Text mb="md" size="md">
              To understand what you should expect, please read through our
              documentation which provides a thorough explanation of the
              interactions using your hotkey.
            </Text>
            <Text mb="md" size="md">
              <strong>Security Tips:</strong>
            </Text>
            <List withPadding>
              <List.Item>
                <b>
                  Always ensure the browser address is from{" "}
                  <Anchor href="https://request.taoshi.io" target="_blank">
                    https://request.taoshi.io
                  </Anchor>
                </b>
              </List.Item>
              <List.Item>
                Verify that the connection is secure by checking for HTTPS in
                the browser address bar.
              </List.Item>
              <List.Item>
                Be cautious of phishing attempts and do not enter your mnemonic
                phrase or other sensitive information on untrusted sites.
              </List.Item>
            </List>
            <Button onClick={handleVerify} variant="light" mt="md">
              Verify Hotkey Ownership
            </Button>
          </Alert>
        )}
        {!validator?.stripeEnabled && (
          <Alert
            className="shadow-sm"
            mb="xl"
            color="orange"
            radius="0"
            title="Verify Stripe Integration"
            icon={<IconAlertCircle />}
          >
            <Text mb="md" size="md">
              Your validator has not been verified yet. Verification is
              essential to ensure that your stripe integration is working
              properly.
            </Text>
            <Button onClick={handleCheckStripe} variant="light" mt="md">
              Verify Integration
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
