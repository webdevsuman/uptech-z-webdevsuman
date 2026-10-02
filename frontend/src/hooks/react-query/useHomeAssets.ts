"use client";

import { useQuery } from "@tanstack/react-query";
import { HomeAssetsQueryEnum } from "./hook-keys/allProject.keys";
import { fetchHomeAssets } from "../../api/functions/home.api";
import { HomeSectionAsset } from "@/typescript/interface/homeAssets.interface";

export const useHomeAssets = () => {
  return useQuery<HomeSectionAsset[]>({
    queryKey: [HomeAssetsQueryEnum.HomeAssets],
    queryFn: fetchHomeAssets,
  });
};

