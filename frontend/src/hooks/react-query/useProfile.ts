"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { IUser } from "@/typescript/interface/auth.interface";

export interface ProfileApiResponse {
  success: boolean;
  message?: string;
  data: IUser;
}

export const ProfileQueryKeys = {
  Profile: "user_profile",
};

export const useProfile = () => {
  return useQuery<IUser | null>({
    queryKey: [ProfileQueryKeys.Profile],
    queryFn: async () => {
      const response = await api.get<ProfileApiResponse>(endpoints.users.profile);
      return response.data ?? null;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileApiResponse, Error, FormData | Record<string, unknown>>({
    mutationFn: async (payload: FormData | Record<string, unknown>) => {
      const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;
      const config = isFormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : undefined;

      const response = await api.patch<ProfileApiResponse>(
        endpoints.users.profile,
        payload,
        config
      );
      return response;
    },
    onSuccess: (data) => {
      queryClient.setQueryData([ProfileQueryKeys.Profile], data.data);
      queryClient.invalidateQueries({
        queryKey: [ProfileQueryKeys.Profile],
      });
    },
  });
};
