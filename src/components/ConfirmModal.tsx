import { Modal, Button, Text, Divider, Box } from "@mantine/core";

export const ConfirmModal = ({
  opened,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: {
  opened: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) => {
  return (
    <Modal opened={opened} onClose={onCancel} title={title} centered>
      <Text className="mb-7">{message}</Text>
      <Divider />
      <Box className="flex justify-end mt-4">
        <Button variant="outline" onClick={onCancel} className="mr-2">
          {cancelLabel}
        </Button>
        <Button onClick={onConfirm}>{confirmLabel}</Button>
      </Box>
    </Modal>
  );
};
