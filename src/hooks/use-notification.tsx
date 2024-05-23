import { showNotification } from "@mantine/notifications";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconBomb,
  IconAlertTriangle,
} from "@tabler/icons-react";

export enum NOTIFICATION_TYPE {
  SUCCESS = "success",
  WARNING = "warning",
  DANGER = "danger",
  INFO = "info",
  BUG = "bug",
}

export const NotificationTypes = Object.keys(NOTIFICATION_TYPE).reduce(
  (prev, key) => {
    prev[NOTIFICATION_TYPE[key]] = key;
    return prev;
  },
  {}
);

export enum NOTIFICATION_COLOR {
  SUCCESS = "green",
  WARNING = "yellow",
  DANGER = "red",
  INFO = "blue",
  BUG = "black",
}
export const NOTIFICATION_ICON = {
  SUCCESS: <IconCheck size={18} />,
  WARNING: <IconAlertTriangle size={18} />,
  DANGER: <IconX size={18} />,
  INFO: <IconAlertCircle size={18} />,
  BUG: <IconBomb size={18} />,
};

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

  const notify = (notification) => {
    const type = NotificationTypes[notification.type || NOTIFICATION_TYPE.SUCCESS];
    showNotification({
      title: notification.title,
      message: notification.content,
      icon: NOTIFICATION_ICON[type],
      color: NOTIFICATION_COLOR[type],
      loading: notification.loading || false,
      autoClose: notification.autoClose,
    });
  };

  return { notifySuccess, notifyError, notifyInfo, notify };
};
