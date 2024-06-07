import { Modal, Button, Text, Divider, Box, MantineSize } from "@mantine/core";
import { ReactNode } from "react";

export const ConfirmModal = ({
  opened,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  size,
}: {
  opened: boolean;
  title: string;
  message: string | ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  size?: number | MantineSize | (string & {});
}) => {
  return (
    <Modal
      opened={opened}
      size={size}
      onClose={onCancel}
      title={title}
      centered
    >
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
