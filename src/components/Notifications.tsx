"use client";

import { UserNotificationType } from "@/db/types/user-notifications";
import {
  Box,
  Button,
  Drawer,
  Loader,
  Notification,
  Popover,
  Text,
} from "@mantine/core";
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
import { IconBell } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { NotificationType } from "@/db/types/notification";

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
  const [deleted, setDeleted] = useState<string | undefined>();
  const [viewedBtnOpen, { close, open }] = useDisclosure();
  function deleteNotification(id: string) {
    setDeleted(id);
    deleteUserNotification(id);
  }

  const markViewed = async (notification?: NotificationType) => {
    if (notification && !notification?.viewed) {
      await updateUserNotification({
        id: notification.id,
        viewed: true,
      });
      notification.viewed = true;
    }
  };

  const markViewedOverTime = () => {
    setTimer(
      setTimeout(async () => {
        if (userNotifications?.length) {
          const notification = userNotifications.find((un) => !un.viewed);
          await markViewed(notification);
        }
        markViewedOverTime();
      }, 5000) as any
    );
  };

  const markAllAsViewed = async () => {
    for (let notification of userNotifications) {
      await markViewed(notification);
    }
  };

  useEffect(() => {
    if (timer) clearTimeout(timer);
    setTimer(undefined);
    if (opened) {
      markViewedOverTime();
    }
  }, [opened]);

  const title = (
    <>
      <Popover
        width={200}
        position="bottom"
        withArrow
        shadow="md"
        opened={viewedBtnOpen}
        disabled={
          !userNotifications.some((un: UserNotificationType) => !un.viewed)
        }
      >
        <Popover.Target>
          <Button
            onClick={markAllAsViewed}
            onMouseEnter={open}
            onMouseLeave={close}
            variant={
              userNotifications?.length &&
              userNotifications.some((un: UserNotificationType) => !un.viewed)
                ? "filled"
                : "outline"
            }
            className="rounded-full px-2 notify-bell"
          >
            <IconBell />
          </Button>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text size="sm">Mark all as viewed.</Text>
        </Popover.Dropdown>
      </Popover>{" "}
      Notifications
    </>
  );
  return (
    <Drawer
      position="right"
      className="app-notifications"
      opened={opened}
      onClose={toggle}
      title={title}
    >
      <br />
      {isLoading ? (
        <Box className="text-center">
          <Loader size="xl" />
        </Box>
      ) : (
        (userNotifications || []).map((userNotification) => (
          <Notification
            key={userNotification.id}
            loading={deleted === userNotification.id}
            className={`${
              userNotification.viewed ? "viewed" : ""
            } app-notification shadow-md border border-gray-200 mb-3`}
            onClose={deleteNotification.bind(
              null,
              userNotification.id as string
            )}
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
            <span className="text-slate-700">
              {userNotification.notification.content}
            </span>
          </Notification>
        ))
      )}
    </Drawer>
  );
}
