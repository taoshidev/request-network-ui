import { sendEmail } from "./email"
import { useNotification } from "@/hooks/use-notification";

export const sendNotification = async (notification) => {
  const { notify } = useNotification();

  notify(notification);

  sendEmail({
    to: notification.user.email,
    template: "notification",
    subject: notification.title,
    templateVariables: {
      title: notification.title,
      content: notification.content
    },
  });
}