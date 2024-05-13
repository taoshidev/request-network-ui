import { useState, useEffect } from "react";
import { Box, Button, Modal, TextInput } from "@mantine/core";
import { TextEditor } from "@/components/TextEditor";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";
import { ContractSchema } from "@/db/types/contract";
import { createContract, updateContract } from "@/actions/contracts";
import { UserType } from "@/db/types/user";

export function ContractModal({
  user,
  opened,
  close,
  contract,
  onSuccess,
}: {
  user: UserType;
  opened: boolean;
  contract?: ContractType | null;
  close: () => void;
  onSuccess?: (contract: ContractType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();

  const getDefaultValues = (contract: ContractType | null) => ({
    id: contract?.id || "",
    title: contract?.title || "",
    content: contract?.content || "",
    userId: user?.id || "",
  });

  const form = useForm<Partial<ContractType>>({
    initialValues: getDefaultValues(contract as ContractType),
    validate: zodResolver(
      ContractSchema.omit({
        id: !contract,
        active: true,
        createdAt: true,
        updatedAt: true,
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues(contract as ContractType));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const onSubmit = async (values: Partial<ContractType>) => {
    setLoading(true);
    try {

      if (!contract) delete values.id;
      const res = contract
        ? await updateContract(values as ContractType)
        : await createContract(values as ContractType);

      notifySuccess(
        `Contract ${contract ? "updated" : "created"} successfully`
      );
      onSuccess?.(res?.data as ContractType);
      form.reset();
      close();
    } catch (error: any) {
      notifyError(error.message || "Failed to create/update contract");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="xl"
      centered
      opened={opened}
      onClose={() => {
        form.reset();
        close();
      }}
      title={`${contract ? "Edit" : "Add"} Terms of Service`}
    >
      <form className="w-full" onSubmit={form.onSubmit(onSubmit)}>
        <TextInput
          mb="md"
          withAsterisk
          label="Contract Title"
          placeholder="Enter a title for your contract"
          {...form.getInputProps("title")}
        />
        <TextEditor<ContractType>
          type="RichTextEditor"
          prop="content"
          form={form}
          label={{ text: "Contract Content", required: true }}
        />
        <Button
          size="sm"
          variant="orange"
          type="submit"
          className="w-full mt-4"
          loading={loading}
        >
          {contract ? "Update Contract" : "Create Contract"}
        </Button>
      </form>
    </Modal>
  );
}
