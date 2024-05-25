"use client";

import { UserNotificationType } from "@/db/types/user-notifications";
import { Box, Drawer, Loader, Notification } from "@mantine/core";
import {
  NOTIFICATION_COLOR,
  NOTIFICATION_ICON,
  NotificationTypes,
} from "@/hooks/use-notification";
import {
  deleteUserNotification,
  updateUserNotification,
} from "@/actions/notifications";
import { useEffect, useState } from "react";

export default function Notifications({
  opened,
  toggle,
  isLoading,
  userNotifications,
}: {
  opened: boolean;
  toggle: () => void;
  isLoading: boolean;
  userNotifications: UserNotificationType[];
}) {
  const [timer, setTimer] = useState();
  async function deleteNotification(id: string) {
    await deleteUserNotification(id);
  }

  const markAsViewed = () => {
    setTimer(
      setTimeout(async () => {
        if (userNotifications?.length) {
          const notification = userNotifications.find(un => !un.viewed);
          if (notification && !notification?.viewed) {
            await updateUserNotification({
              id: notification.id,
              viewed: true,
            });
            notification.viewed = true;
          }
        }
        markAsViewed();
      }, 5000) as any
    );
  };

  useEffect(() => {
    if (timer) clearTimeout(timer);
    setTimer(undefined);
    if (opened) {
      markAsViewed();
    }
  }, [opened]);

  return (
    <Drawer
      position="right"
      className="app-notifications"
      opened={opened}
      onClose={toggle}
      title="Notifications"
    >
      <br />
      {isLoading ? (
        <Box className="text-center">
          <Loader size="xl" />
        </Box>
      ) : (
        (userNotifications || []).map((userNotification) => (
          <Notification
            onClose={deleteNotification.bind(
              null,
              userNotification.id as string
            )}
            key={userNotification.id}
            className={`${
              userNotification.viewed ? "viewed" : ""
            } app-notification shadow-md border-gray-200 mb-3`}
            icon={
              NOTIFICATION_ICON[
                NotificationTypes[userNotification.notification.type]
              ]
            }
            color={
              NOTIFICATION_COLOR[
                NotificationTypes[userNotification.notification.type]
              ]
            }
            title={userNotification.notification.subject}
          >
            {userNotification.notification.content}
          </Notification>
        ))
      )}
    </Drawer>
  );
}
