"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoryQueryEnum } from "./hook-keys/allProject.keys";
import { endpoints } from "@/api/endpoints";
import api from "@/api/apiClient";
import { ICategory } from "@/typescript/interface/category.interface";

export interface CategoryApiResponse {
  success: boolean;
  data: ICategory[];
}

export const useCategories = () => {
  return useQuery<ICategory[]>({
    queryKey: [CategoryQueryEnum.Categories],
    queryFn: async () => {
      const response = await api.get<CategoryApiResponse>(endpoints.categories.list);
      return response.data ?? [];
    },
  });
};
