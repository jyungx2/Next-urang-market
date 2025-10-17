import React from "react";
import { useNotification } from "@/store/notification-context";
import Notification from "@/components/common/notification";

export const NotificationLayer = React.memo(function NotificationLayer() {
  // const { isNotificationOpen } = useContext(NotificationContext);
  const { isNotificationOpen } = useNotification();

  if (!isNotificationOpen) return null;
  return (
    <div className="bg-black bg-opacity-50 z-40">
      <Notification />
    </div>
  );
});
