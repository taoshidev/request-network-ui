import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react";

export const useNotification = () => {
  const notifySuccess = (message: string) => {
    showNotification({
      message,
      icon: <IconCheck size={18} />,
      color: "green",
    });
  };

  const notifyError = (message: string) => {
    showNotification({
      message,
      icon: <IconX size={18} />,
      color: "red",
    });
  };

  const notifyInfo = (message: string) => {
    showNotification({
      message,
      icon: <IconAlertCircle size={18} />,
      color: "blue",
    });
  };

  return { notifySuccess, notifyError, notifyInfo };
};