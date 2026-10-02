import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";
import { HomeSectionAsset } from "@/typescript/interface/homeAssets.interface";

export const fetchHomeAssets = async (): Promise<HomeSectionAsset[]> => {
  try {
    const res = await axiosInstance.get(endpoints.cms.homepage);
    return res?.data?.data;
  } catch (error) {
    console.log("Error fetching home assets:", error);
    return [];
  }
};
