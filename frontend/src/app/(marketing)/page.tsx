"use client";

import { useHomeAssets } from "@/hooks/react-query/useHomeAssets";
import React from "react";

const Homepage = () => {
  const { data, isPending, error } = useHomeAssets();
  console.log("Data:", data);
  return <div>Homepage</div>;
};

export default Homepage;
