import { useState, useEffect } from "react";
import { Modal, Button, Text, Box, MantineSize } from "@mantine/core";
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
  const [loading, setLoading] = useState(false);
  const handleClose = () => {
    setLoading(false);
    onCancel?.();
  };
  const handleConfirm = () => {
    setLoading(true);
    onConfirm?.();
  };

  useEffect(() => {
    return () => {
      setLoading(false);
    };
  });

  return (
    <Modal
      opened={opened}
      size={size}
      onClose={handleClose}
      title={title}
      centered
    >
      <Text className="mb-7">{message}</Text>
      <Box className="flex justify-end mt-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4">
        <Button variant="outline" onClick={handleClose} className="mr-2">
          {cancelLabel}
        </Button>
        <Button onClick={handleConfirm} loading={loading}>
          {confirmLabel}
        </Button>
      </Box>
    </Modal>
  );
};
