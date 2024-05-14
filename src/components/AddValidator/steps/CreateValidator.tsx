"use client";

import { Box, TextInput, Textarea } from "@mantine/core";
import {
  checkHotkeyExists,
} from "@/actions/validators";
import { useNotification } from "@/hooks/use-notification";

// const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);

export function CreateValidator({
  form,
  hotkeyExists,
  setHotkeyExists,
}: any) {
  const { notifyError } = useNotification();

  const { values } = form;

  const handleOnBlurHotkey = async (evt) => {
    const hotkey = values.hotkey;
    if (hotkey) {
      try {
        const exists = await checkHotkeyExists(hotkey);
        if (exists) {
          notifyError("Hotkey already in use by another validator.");
          setHotkeyExists(exists as boolean);
        }
      } catch (error: Error | unknown) {
        throw new Error((error as Error)?.message);
      }
    }
  };

  return (
    <>
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
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Hotkey"
          placeholder="Hotkey"
          {...form.getInputProps("hotkey")}
          onBlur={(event) => {
            form.getInputProps("hotkey").onBlur(event);
            handleOnBlurHotkey(event);
          }}
          onChange={(event) => {
            form.getInputProps("hotkey").onChange(event);
            setHotkeyExists(false);
          }}
        />
        {hotkeyExists && (
          <p className="pt-1 text-xs text-[#fa5252] mantine-TextInput-error">
            Hotkey already in use by another validator.
          </p>
        )}
      </Box>
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Request Network API Url"
          placeholder="https://example.com:8080"
          {...form.getInputProps("baseApiUrl")}
        />
      </Box>
    </>
  );
}
