"use client";
import { SupportEmailType, SupportEmailSchema } from "@/db/types/support-email";
import { Box, Text, TextInput, Textarea, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useState } from "react";
import { isEmpty as _isEmpty } from "lodash";
import { useDisclosure } from "@mantine/hooks";
import { ConfirmModal } from "./ConfirmModal";
import { useRouter } from "next/navigation";
import { sendSupportEmail } from "@/actions/support-emails";

export default function SupportEmailForm({ user }) {
  const router = useRouter();
  const getDefaultValues = () => ({
    subject: "",
    content: "",
  });
  const [done, setDone] = useState(false);
  const [visible, { open: show, close: hide }] = useDisclosure(false);
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm<Partial<SupportEmailType>>({
    initialValues: getDefaultValues(),
    validate: zodResolver(
      SupportEmailSchema.pick({
        subject: true,
        content: true,
      })
    ),
  });

  function valid() {
    const errors = {
      subject: !form.values.subject && "Subject required",
      content: !form.values.content && "Content required",
    };

    form.setErrors(errors);
    return Object.keys(errors).every((k) => !errors[k]);
  }

  const onSubmit = async (values: Partial<SupportEmailType>) => {
    if (valid()) {
      open();
    }
  };

  async function handleSendSupportEmail() {
    await sendSupportEmail(form.values, user);
    setDone(true);
    setTimeout(() => show(), 0);
    close();
  }

  return (
    <Box className="relative w-full">
      <ConfirmModal
        size="xl"
        opened={opened}
        title="Send Support Email"
        message={
          <>
            Ready to send your support email?
            <br />
            <br />
            <span className="font-bold">Subject:</span> {form.values.subject}
            <br />
            <span className="font-bold">Content: </span>
            {form.values.content}`
          </>
        }
        onConfirm={handleSendSupportEmail}
        onCancel={close}
      />
      <Box
        component="form"
        className="w-full"
        onSubmit={form.onSubmit(onSubmit)}
      >
        <TextInput
          mb="md"
          withAsterisk
          label="Subject"
          placeholder="Enter a support subject"
          {...form.getInputProps("subject")}
        />
        <Textarea
          mb="md"
          withAsterisk
          label="Support Message"
          placeholder="Enter your support questions here."
          minRows={5}
          {...form.getInputProps("content")}
          autosize
        />
        <Box className="pt-5 text-right">
          <Button type="submit">Send</Button>
        </Box>
      </Box>
      {done && (
        <Box
          component="form"
          className={`w-full bg-stone-100 absolute top-0 pointer-events-none animate-opacity${
            visible ? " show" : ""
          }`}
          onSubmit={form.onSubmit(onSubmit)}
        >
          <TextInput
            mb="md"
            withAsterisk
            label="Subject"
            placeholder="Enter a support subject"
            classNames={{ input: "bg-stone-100 border-transparent" }}
            {...form.getInputProps("subject")}
            readOnly
          />
          <Textarea
            mb="md"
            withAsterisk
            label="Support Message"
            placeholder="Enter your support questions here."
            classNames={{ input: "bg-stone-100 border-transparent" }}
            minRows={5}
            {...form.getInputProps("content")}
            autosize
            readOnly
          />
          <Box className="pt-5 flex justify-between">
            <Text className="inline-block">Support email sent.</Text>
            <Button variant="light" type="button" onClick={() => router.back()}>
              Done
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
