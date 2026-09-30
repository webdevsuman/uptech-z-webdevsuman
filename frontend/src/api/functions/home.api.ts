import axiosInstance from "../axiosInstance";
import { endpoints } from "../endpoints";

export const fetchHomeAssets = async () => {
  try {
    const res = await axiosInstance.get(endpoints.cms.homepage);
    return res?.data?.data;
  } catch (error) {
    console.log("Error fetching home assets:", error);
  }
};
