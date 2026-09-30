"use client";

import { useQuery } from "@tanstack/react-query";
import { HomeAssetsQueryEnum } from "./hook-keys/allProject.keys";
import { fetchHomeAssets } from "../../api/functions/home.api";

export const useHomeAssets = () => {
  return useQuery({
    queryKey: [HomeAssetsQueryEnum.HomeAssets],
    queryFn: fetchHomeAssets,
  });
};
