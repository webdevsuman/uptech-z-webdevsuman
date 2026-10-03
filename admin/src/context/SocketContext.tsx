"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { baseURL } from "@/lib/constants";
import { getToken } from "@/lib/functions/auth.lib";
import { NotificationEnum } from "@/api/hooks/notification/key";
import {
  INotificationItem,
  TNotificationsResponse,
} from "@/api/hooks/notification/schema";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const socketUrl = baseURL || "http://localhost:5000";

    const socketInstance = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Listen for new notifications emitted from backend
    socketInstance.on("notification:new", (newNotif: INotificationItem) => {
      // 1. Trigger Sonner alert toast
      toast.info(newNotif.title || "New Notification", {
        description: newNotif.message,
        duration: 6000,
      });

      // 2. Prepend notification and increment unread count in cache
      queryClient.setQueryData<TNotificationsResponse>(
        [NotificationEnum.list],
        (oldData) => {
          if (!oldData?.data) return oldData;
          return {
            ...oldData,
            data: {
              ...oldData.data,
              notifications: [newNotif, ...oldData.data.notifications],
              unreadCount: (oldData.data.unreadCount || 0) + 1,
            },
          };
        }
      );

      // Invalidate to synchronize
      queryClient.invalidateQueries({ queryKey: [NotificationEnum.list] });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
