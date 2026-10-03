"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { baseURL } from "@/config/constants";
import { getToken } from "@/lib/token.lib";
import { useAuth } from "@/context/AuthContext";
import { QnAQueryEnum } from "@/hooks/react-query/hook-keys/allProject.keys";
import {
  InstructorQuestionsData,
  QnANewQuestionSocketPayload,
  QnACountsUpdatedSocketPayload,
} from "@/typescript/interface/qna.interface";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = (): SocketContextType => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const token = getToken();
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

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

    // Real-time listener: New question asked by student
    socketInstance.on("qna:new_question", (data: QnANewQuestionSocketPayload) => {
      // 1. Toast alert for instructor
      toast.info(`New Question: ${data.courseTitle || "Course Q&A"}`, {
        description: `${data.studentName || "A student"}: "${data.question?.title || "New question asked"}"`,
        duration: 6000,
      });

      // 2. Optimistically update unanswered counts in react-query cache
      queryClient.setQueriesData<InstructorQuestionsData>(
        { queryKey: [QnAQueryEnum.InstructorQuestions] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            questions: data.question
              ? [data.question, ...oldData.questions]
              : oldData.questions,
            counts: {
              ...oldData.counts,
              total: (oldData.counts?.total || 0) + 1,
              unanswered:
                typeof data.unansweredCount === "number"
                  ? data.unansweredCount
                  : (oldData.counts?.unanswered || 0) + 1,
            },
          };
        }
      );

      // Invalidate both instructor and course questions queries
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.InstructorQuestions],
      });
      queryClient.invalidateQueries({
        queryKey: [QnAQueryEnum.CourseQuestions],
      });
    });

    // Real-time listener: Updated unanswered counts (e.g. after answering or deleting)
    socketInstance.on(
      "qna:counts_updated",
      (data: QnACountsUpdatedSocketPayload) => {
        if (typeof data.unansweredCount === "number") {
          queryClient.setQueriesData<InstructorQuestionsData>(
            { queryKey: [QnAQueryEnum.InstructorQuestions] },
            (oldData) => {
              if (!oldData) return oldData;
              return {
                ...oldData,
                counts: {
                  ...oldData.counts,
                  unanswered: data.unansweredCount,
                },
              };
            }
          );
        }
        queryClient.invalidateQueries({
          queryKey: [QnAQueryEnum.InstructorQuestions],
        });
      }
    );

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
      socketRef.current = null;
    };
  }, [user, queryClient]);

  const contextValue = useMemo(
    () => ({ socket, isConnected }),
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
