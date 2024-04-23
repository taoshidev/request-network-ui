"use client";

import { useState } from "react";
import { Box, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { stringToHex, u8aToHex } from "@polkadot/util";

import { isAddress } from "@/utils/address";
import { updateUser } from "@/actions/auth";
import { createValidator } from "@/actions/validators";

import { sign, isValidSignature } from "@/lib/polkadot";

const settingsSchema = z.object({
  hotkey: z.string().refine((value) => isAddress({ address: value }), {
    message: "Invalid Bittensor address",
  }),
});

type Settings = z.infer<typeof settingsSchema>;

export function Verify({ onComplete, user }: any) {
  const [loading, setLoading] = useState(false);

  const form = useForm<Settings>({
    initialValues: {
      hotkey: "5DfaKz2Cvn4jh3fTdq2KBegGUYfMiQqmE8U4RRSSA3C8z97U",
    },
    validate: zodResolver(settingsSchema),
  });

  const onSubmit = async (values: Settings) => {
    const message = "kenneth";

    const { signature, account } = await sign(message);
    const test = await isValidSignature(message, signature, account.address);

    // setLoading(true);
    // try {
    //   await createValidator({
    //     id: user.id,
    //     hotkey: values.hotkey,
    //   });
    //   const { error: UpdateUserError } = await updateUser({
    //     data: { onboarding: { step: 1 } },
    //   });
    //   onComplete();
    //   setLoading(false);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <Box>
      <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
        <Box mb="md">
          <TextInput
            withAsterisk
            label="Hotkey"
            placeholder="Validator Hotkey"
            {...form.getInputProps("hotkey")}
          />
        </Box>
        <Box mt="lg">
          <Button type="submit" w="100%" loading={loading}>
            Verify
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
