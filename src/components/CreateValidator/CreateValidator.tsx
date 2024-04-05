"use client";

import { useState } from "react";
import { Box, Button, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { EndpointFormInput } from "@components/EndpointFormInput";
import { createValidatorEndpoint } from "@/actions/validators";
import { ValidatorSchema, ValidatorType } from "@/db/types/validator";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { useNotification } from "@/hooks/use-notification";

const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);
export function CreateValidator({ onComplete, user, subnets }: any) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const form = useForm<Partial<ValidatorType & EndpointType>>({
    initialValues: {
      name: "",
      description: "",
      userId: user.id,
      verified: false,
      enabled: false,
      hotkey: "",
      subnet: "",
      limit: 10,
      url: "",
      refillRate: 1,
      refillInterval: 1000,
      remaining: 1000,
      expires: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    },
    validate: zodResolver(ValidatorEndpointSchema),
  });

  const onSubmit = async (values: Partial<ValidatorType & EndpointType>) => {
    setLoading(true);
    const { name, description, userId, hotkey, ...endpoint } = values;
    const validator = { name, description, userId, hotkey };
    try {
      const res = await createValidatorEndpoint(validator, endpoint);

      const { validator: newValidator } = res as {
        validator: ValidatorType;
      };

      const { apiId: apiKey, apiSecret } = newValidator;
      onComplete({ apiKey, apiSecret });

      notifySuccess("Validator registered successfully");
    } catch (error: Error | unknown) {
      notifyError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        component="form"
        className="w-full"
        onSubmit={form.onSubmit(onSubmit)}
      >
        <TextInput
          mb="md"
          withAsterisk
          label="Validator Name"
          placeholder="Enter a name for your validator"
          {...form.getInputProps("name")}
        />
        <Textarea
          mb="md"
          withAsterisk
          label="Description"
          placeholder="Enter a brief description for your validator"
          {...form.getInputProps("description")}
        />
        <Box className="mb-4">
          <TextInput
            withAsterisk
            label="Hotkey"
            placeholder="Hotkey"
            {...form.getInputProps("hotkey")}
          />
        </Box>
        <EndpointFormInput form={form} subnets={subnets} />
        <Box>
          <Button type="submit" className="w-full" loading={loading}>
            Create
          </Button>
        </Box>
      </Box>
    </>
  );
}
