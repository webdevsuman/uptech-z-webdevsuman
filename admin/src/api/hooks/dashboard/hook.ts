"use client";

import { useQuery } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import { api } from "@/api/apiClient";
import { DashboardEnum } from "./key";
import { TDashboardAnalyticsResponse } from "./schema";

export const useAdminDashboardAnalytics = () => {
  return useQuery({
    queryKey: [DashboardEnum.analytics],
    queryFn: () =>
      api.get<TDashboardAnalyticsResponse>(endpoints.analytics.dashboard),
  });
};
