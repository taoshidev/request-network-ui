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
  Alert,
  Card,
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
import { IconCircleCheck, IconBell } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import removeMd from "remove-markdown";
import clsx from "clsx";

export default function Notifications({
  opened,
  toggle,
  isLoading,
  userNotifications,
  refresh,
}: {
  opened: boolean;
  toggle: () => void;
  isLoading: boolean;
  userNotifications: UserNotificationType[];
  refresh: () => void;
}) {
  const [timer, setTimer] = useState();
  const [deleted, setDeleted] = useState<string | undefined>();
  const [viewedBtnOpen, { close, open }] = useDisclosure();
  const [loading, setLoading] = useState(false);

  const deleteNotification = (id: string) => {
    setDeleted(id);
    deleteUserNotification(id);
    refresh();
  };

  const handleDeleteAllNotifications = async () => {
    setLoading(true);
    for (const userNotification of userNotifications) {
      await deleteUserNotification(userNotification?.id as string);
    }
    refresh();
    setLoading(false);
  };

  const markViewed = async (userNotification?: UserNotificationType) => {
    if (userNotification && !userNotification?.viewed) {
      await updateUserNotification({
        id: userNotification.id,
        viewed: true,
      });
      userNotification.viewed = true;
    }
  };

  const markViewedOverTime = () => {
    setTimer(
      setTimeout(async () => {
        if (userNotifications?.length) {
          const userNotification = userNotifications.find((un) => !un.viewed);
          await markViewed(userNotification);
        }
        markViewedOverTime();
      }, 5000) as any
    );
  };

  const markAllAsViewed = async () => {
    console.log("Marking all as viewed");
    for (let userNotification of userNotifications) {
      await markViewed(userNotification);
    }
  };

  useEffect(() => {
    if (timer) clearTimeout(timer);
    setTimer(undefined);
    if (opened) {
      markViewedOverTime();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            className="rounded-full aspect-square px-0 notify-bell mr-2"
          >
            <IconBell />
          </Button>
        </Popover.Target>
        <Popover.Dropdown style={{ pointerEvents: "none" }}>
          <Text size="sm">Mark all as Viewed.</Text>
        </Popover.Dropdown>
      </Popover>{" "}
      Notifications
    </>
  );

  return (
    <Drawer
      position="right"
      className="app-notifications h-full"
      opened={opened}
      onClose={toggle}
      title={title}
    >
      <br />
      <Box className="flex flex-col h-full">
        {isLoading ? (
          <Box className="flex-grow flex justify-center items-center">
            <Loader size="lg" />
          </Box>
        ) : userNotifications.length > 0 ? (
          <>
            <Box className="flex-grow overflow-y-auto">
              {(userNotifications || []).map((userNotification) => (
                <Card
                  key={userNotification.id}
                  className="border-gray-200 shadow-sm p-0 mb-3"
                  withBorder
                >
                  <Notification
                    loading={deleted === userNotification.id}
                    className={clsx(
                      "app-notification shadow-sm",
                      userNotification.viewed ? "viewed" : ""
                    )}
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
                    {removeMd(userNotification.notification.content)}
                  </Notification>
                </Card>
              ))}
            </Box>
            <Box className="flex justify-center mt-auto">
              <Button
                onClick={handleDeleteAllNotifications}
                variant="subtle"
                className="my-6"
                loading={loading}
              >
                Remove All Notifications
              </Button>
            </Box>
          </>
        ) : (
          <Box className="flex justify-center items-center">
            <Alert
              className="mb-7 shadow-sm w-full border-gray-200"
              color="orange"
              variant="light"
              icon={<IconCircleCheck size="1rem" />}
            >
              <Text className="mb-7">Awesome! You&apos;re all caught up.</Text>
            </Alert>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
