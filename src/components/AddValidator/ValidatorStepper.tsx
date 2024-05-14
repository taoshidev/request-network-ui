"use client";

import { Box, Button, Group, Stepper, Table, Text, Title } from "@mantine/core";
import { useState } from "react";
import { CreateValidator } from "./steps/CreateValidator";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { createValidatorEndpoint } from "@/actions/validators";
import { DatabaseResponseType } from "@/db/error";
import { useNotification } from "@/hooks/use-notification";
import { EndpointForm1 } from "./steps/EndpointForm1";
import { EndpointForm2 } from "./steps/EndpointForm2";
import { isEmpty as isEmpty, lte } from "lodash";

type KeyType = { apiKey: string; apiSecret: string };

export default function ValidatorStepper({
  user,
  subnets,
  contracts,
  expires,
}) {
  const stepInputs = [
    ["name", "description", "hotkey", "baseApiUrl"],
    ["url", "contractId", "currencyType", "walletAddress", "price"],
    ["expires", "limit", "refillRate", "refillInterval"],
  ];
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });
  const [walletExists, setWalletExists] = useState<boolean>(false);
  const [keyModalOpened, setKeyModalOpened] = useState(false);
  const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);
  const [hotkeyExists, setHotkeyExists] = useState<boolean>(false);
  const { notifySuccess, notifyError } = useNotification();
  const form = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      name: "",
      description: "",
      userId: user?.id || "",
      verified: false,
      enabled: false,
      currencyType: "Crypto",
      walletAddress: "",
      price: "",
      hotkey: "",
      subnetId: "",
      limit: 10,
      baseApiUrl: "",
      url: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
      expires,
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const [active, setActive] = useState(0);

  function getErrors() {
    const nextErrors =
      ValidatorEndpointSchema.safeParse(form.values)?.["error"]?.issues?.reduce(
        (prev, curr) => {
          prev[curr.path[0]] = curr.message;
          return prev;
        },
        {}
      ) || {};
    setErrors(nextErrors);
    return nextErrors;
  }

  function valid() {
    const currentErrors = getErrors();
    return stepInputs.reduce((prev, curr, index) => {
      let error = false;
      for (let key of Object.keys(currentErrors)) {
        if (curr.includes(key)) error = true;
      }
      prev.push(!error as any);
      return prev;
    }, []);
  }

  const setStep = (step) => {
    if (step === 0 || valid()[step - 1]) setActive(step);
  };

  const nextStep = () => {
    if (valid()[active])
      setActive((current) => (current < 3 ? current + 1 : current));
  };
  const prevStep = () => {
    getErrors();
    setActive((current) => (current > 0 ? current - 1 : current));
  };

  const handleRegistrationComplete = ({ apiKey, apiSecret }: KeyType) => {
    setKeys({ apiKey, apiSecret });
    setKeyModalOpened(true);
    // send validator created email
  };

  const onSubmit = async (values: Partial<ValidatorType & EndpointType>) => {
    setLoading(true);

    const { name, description, userId, hotkey, baseApiUrl, ...endpoint } =
      values;
    const validator = { name, description, userId, hotkey, baseApiUrl };
    try {
      const res = await createValidatorEndpoint(validator, endpoint);

      if ((res as DatabaseResponseType)?.error)
        throw new Error((res as DatabaseResponseType)?.message);
      const { validator: newValidator } = res as {
        validator: ValidatorType;
      };
      const { apiId: apiKey = "", apiSecret = "" } = newValidator;
      handleRegistrationComplete({
        apiKey: apiKey as string,
        apiSecret: apiSecret as string,
      });

      notifySuccess("Validator registered successfully");
    } catch (error: Error | unknown) {
      notifyError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={keyModalOpened}
        onClose={() => setKeyModalOpened(false)}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="API Access Key"
      />

      <Box
        component="form"
        className="w-full"
        onSubmit={form.onSubmit(onSubmit)}
      >
        <Stepper active={active} onStepClick={setStep}>
          <Stepper.Step
            label="Create Validator"
            description="Validator information"
          >
            <CreateValidator
              form={form}
              subnets={subnets}
              onComplete={handleRegistrationComplete}
              hotkeyExists={hotkeyExists}
              setHotkeyExists={setHotkeyExists}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Create Endpoint"
            description="Endpoint information"
          >
            <EndpointForm1
              form={form}
              subnets={subnets}
              contracts={contracts}
              onError={(event) => {
                setWalletExists(event.error);
              }}
            />
          </Stepper.Step>
          <Stepper.Step
            label="Create Endpoint 2"
            description="Endpoint information"
          >
            <EndpointForm2
              form={form}
              onError={(event) => {
                setWalletExists(event.error);
              }}
            />
          </Stepper.Step>
          <Stepper.Completed>
            <Title order={2} className="text-center">
              Review Validator Details
            </Title>
            <Box className="flex justify-center w-full mb-16">
              <Box className="w-full overflow-y-auto">
                <Table miw={600} verticalSpacing="xs">
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Th colSpan={1} w={200}>
                        Name
                      </Table.Th>
                      <Table.Td colSpan={3}>{form.values.name}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th colSpan={1}>Description</Table.Th>
                      <Table.Td colSpan={3}>{form.values.description}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th colSpan={1} w={200}>
                        Currency Type
                      </Table.Th>
                      <Table.Td colSpan={1}>
                        {form.values.currencyType}
                      </Table.Td>
                      <Table.Th colSpan={1}>Wallet Address</Table.Th>
                      <Table.Td colSpan={1}>
                        {form.values.walletAddress}
                      </Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Price</Table.Th>
                      <Table.Td>{form.values.price}</Table.Td>
                      <Table.Th>Hot Key</Table.Th>
                      <Table.Td>{form.values.hotkey}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Limit</Table.Th>
                      <Table.Td>{form.values.limit}</Table.Td>
                      <Table.Th>Base API URL</Table.Th>
                      <Table.Td>{form.values.baseApiUrl}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>URL</Table.Th>
                      <Table.Td>{form.values.url}</Table.Td>
                      <Table.Th>Refill Rate</Table.Th>
                      <Table.Td>{form.values.refillRate}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Refill Interval</Table.Th>
                      <Table.Td>{form.values.refillInterval}</Table.Td>
                      <Table.Th>Remaining</Table.Th>
                      <Table.Td>{form.values.remaining}</Table.Td>
                    </Table.Tr>
                    {/* <Table.Tr>
                      <Table.Th>Expires</Table.Th>
                      <Table.Td>{form.values.expires}</Table.Td>
                    </Table.Tr> */}
                  </Table.Tbody>
                </Table>
              </Box>
            </Box>
            <Button
              type="submit"
              loading={loading}
              disabled={hotkeyExists || walletExists}
              className="w-full mb-4"
            >
              Create
            </Button>
            {isEmpty(errors) && (
              <Text className="text-center">
                Completed. Click button to create validator and endpoint.
              </Text>
            )}
            {Object.keys(errors).map((key) => (
              <Text className="text-center text-red-600" key={key}>
                <b>{key}</b>: {errors[key]}
              </Text>
            ))}
          </Stepper.Completed>
        </Stepper>

        <Group justify="center" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active < 1}>
            Back
          </Button>
          <Button onClick={nextStep} disabled={active > 2}>
            Next step
          </Button>
        </Group>
      </Box>
    </>
  );
}
