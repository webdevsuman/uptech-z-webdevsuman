"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  useAdminNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
} from "@/api/hooks/notification/hook";
import { INotificationItem } from "@/api/hooks/notification/schema";
import { mediaUrl } from "@/api/endpoints";
import { AppIcon } from "@/components/ui/app-icon";

const formatTimeAgo = (dateStr: string): string => {
  if (!dateStr) return "";
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { data, isLoading } = useAdminNotifications();
  const { mutate: markRead } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } =
    useMarkAllNotificationsRead();
  const { mutate: deleteNotification } = useDeleteNotification();
  const { mutate: deleteAllNotifications, isPending: isClearingAll } =
    useDeleteAllNotifications();

  const notifications = data?.data?.notifications || [];
  const unreadCount = data?.data?.unreadCount || 0;

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleNotificationClick = (item: INotificationItem) => {
    if (!item.isRead) {
      markRead({ id: item._id });
    }
    closeDropdown();
    const destination = item.data?.link || "/courses/list";
    router.push(destination);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNotification({ id });
  };

  return (
    <div className="relative">
      <button
        className="relative dropdown-toggle flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white cursor-pointer"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        {unreadCount > 0 && (
          <span className="absolute right-0 top-0.5 z-10 flex h-2.5 w-2.5">
            <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping" />
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-orange-500" />
          </span>
        )}

        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.75 2.29248C10.75 1.87827 10.4143 1.54248 10 1.54248C9.58583 1.54248 9.25004 1.87827 9.25004 2.29248V2.83613C6.08266 3.20733 3.62504 5.9004 3.62504 9.16748V14.4591H3.33337C2.91916 14.4591 2.58337 14.7949 2.58337 15.2091C2.58337 15.6234 2.91916 15.9591 3.33337 15.9591H4.37504H15.625H16.6667C17.0809 15.9591 17.4167 15.6234 17.4167 15.2091C17.4167 14.7949 17.0809 14.4591 16.6667 14.4591H16.375V9.16748C16.375 5.9004 13.9174 3.20733 10.75 2.83613V2.29248ZM14.875 14.4591V9.16748C14.875 6.47509 12.6924 4.29248 10 4.29248C7.30765 4.29248 5.12504 6.47509 5.12504 9.16748V14.4591H14.875ZM8.00004 17.7085C8.00004 18.1228 8.33583 18.4585 8.75004 18.4585H11.25C11.6643 18.4585 12 18.1228 12 17.7085C12 17.2943 11.6643 16.9585 11.25 16.9585H8.75004C8.33583 16.9585 8.00004 17.2943 8.00004 17.7085Z"
            fill="currentColor"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[350px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900 sm:w-[380px] lg:right-0 z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-2">
            <h5 className="text-base font-semibold text-gray-800 dark:text-gray-200">
              Notifications
            </h5>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                disabled={isMarkingAll}
                className="text-xs text-brand-500 hover:text-brand-600 font-medium transition cursor-pointer disabled:opacity-50"
              >
                Mark read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={() => deleteAllNotifications()}
                disabled={isClearingAll}
                className="text-xs text-red-500 hover:text-red-600 font-medium transition cursor-pointer disabled:opacity-50"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List (Scrollable) */}
        <ul className="flex flex-col flex-1 max-h-[380px] overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {isLoading ? (
            <li className="flex items-center justify-center h-48 text-gray-400 text-sm">
              <AppIcon icon="lucide:loader" className="w-5 h-5 animate-spin mr-2" />
              Loading notifications...
            </li>
          ) : notifications.length === 0 ? (
            <li className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
              <AppIcon icon="lucide:bell-off" className="w-8 h-8 opacity-40" />
              <p>No notifications yet</p>
            </li>
          ) : (
            notifications.map((item) => {
              const avatar = item.data?.instructorAvatar
                ? mediaUrl(item.data.instructorAvatar)
                : null;
              const instructorInitials = (item.data?.instructorName || "IN")
                .slice(0, 2)
                .toUpperCase();

              return (
                <li key={item._id} className="relative group">
                  <DropdownItem
                    onItemClick={() => handleNotificationClick(item)}
                    className={`flex items-start gap-3 rounded-xl p-2.5 transition cursor-pointer text-left ${
                      !item.isRead
                        ? "bg-brand-50/60 dark:bg-brand-500/10 border-l-3 border-brand-500"
                        : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    }`}
                  >
                    <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-brand-50 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-brand-600">
                      {avatar ? (
                        <Image
                          src={avatar}
                          alt="Instructor"
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        instructorInitials
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-gray-400 shrink-0">
                          {formatTimeAgo(item.createdAt)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2">
                        {item.message}
                      </p>

                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-brand-500">
                        <span>Review course</span>
                        <AppIcon icon="lucide:arrow-right" className="w-3 h-3" />
                      </div>
                    </div>
                  </DropdownItem>

                  {/* Individual Delete Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item._id)}
                    title="Delete notification"
                    className="absolute right-2.5 top-3 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition cursor-pointer"
                  >
                    <AppIcon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </Dropdown>
    </div>
  );
}
