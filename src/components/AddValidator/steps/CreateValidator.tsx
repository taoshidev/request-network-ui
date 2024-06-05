"use client";

import { Box, TextInput, Textarea } from "@mantine/core";
import { checkHotkeyExists } from "@/actions/validators";
import { useNotification } from "@/hooks/use-notification";
import { TextEditor } from "@/components/TextEditor";
import { ValidatorType } from "@/db/types/validator";
import { UserType } from "@/db/types/user";

// const ValidatorEndpointSchema = ValidatorSchema.merge(EndpointSchema);

export function CreateValidator({
  form,
  hotkeyExists,
  onHotkeyExists,
  user,
}: {
  form: any;
  hotkeyExists: boolean;
  onHotkeyExists: (exists: boolean) => void;
  user: UserType;
}) {
  const { notifyError } = useNotification();

  const { values } = form;

  const handleOnBlurHotkey = async (evt) => {
    const hotkey = values.hotkey;
    if (hotkey) {
      try {
        const exists = await checkHotkeyExists(hotkey);
        if (exists) {
          notifyError("Hotkey already in use by another validator.");
          onHotkeyExists(exists as boolean);
        }
      } catch (error: Error | unknown) {
        throw new Error((error as Error)?.message);
      }
    }
  };

  return (
    <Box className="pt-8">
      <TextInput
        mb="md"
        withAsterisk
        label="Validator Name"
        placeholder="Enter a name for your validator"
        {...form.getInputProps("name")}
      />
      <TextEditor<ValidatorType>
        type="BubbleEditor"
        prop="description"
        form={form}
        placeholder="Enter your validator description."
        label={{ text: "Description (Rich text format)", required: true }}
      />
      {user?.user_metadata?.crypto_enabled && (
        <Box mb="md" className="pt-3">
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
              onHotkeyExists(false);
            }}
          />
          {hotkeyExists && (
            <p className="pt-1 text-xs text-[#fa5252] mantine-TextInput-error">
              Hotkey already in use by another validator.
            </p>
          )}
        </Box>
      )}
      <Box className="pt-3" mb="md">
        <TextInput
          withAsterisk
          label="Request Network API Url"
          placeholder="https://example.com:8080"
          {...form.getInputProps("baseApiUrl")}
        />
      </Box>
    </Box>
  );
}
