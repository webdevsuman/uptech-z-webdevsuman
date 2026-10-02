import { Box } from "@mui/material";
import React from "react";
import { TitleSubheading } from "../TitleSubheading";
import { AcceleratorCard } from "./AcceleratorCard";

interface CareerAcceleratorsProps {
  title?: string;
  description?: string;
}

export const CareerAccelerators = ({
  title = "Ready to reimagine your career?",
  description = "Get the skills and real-world experience employers want with Career Accelerators.",
}: CareerAcceleratorsProps) => {
  const cardData = [
    {
      id: "1",
      title: "Full Stack Web Developer",
      image_path:
        "https://zflnkjkdpxoeookqgwrw.supabase.co/storage/v1/object/public/accelerator-images/web_developer.jpg",
      stars: "4.7",
      ratings: "455K",
      hours: "87.8",
    },
    {
      id: "2",
      title: "Data Scientist",
      image_path:
        "https://zflnkjkdpxoeookqgwrw.supabase.co/storage/v1/object/public/accelerator-images/data_scientist.jpg",
      stars: "4.6",
      ratings: "220K",
      hours: "47.1",
    },
    {
      id: "3",
      title: "Digital Marketer",
      image_path:
        "https://zflnkjkdpxoeookqgwrw.supabase.co/storage/v1/object/public/accelerator-images/digital_marketer.jpg",
      stars: "4.5",
      ratings: "3.5K",
      hours: "28.4",
    },
  ];
  return (
    <Box className="my-20!">
      <TitleSubheading
        title={title}
        subheading={description}
      />
      <div className="flex items-center justify-center flex-wrap">

      {cardData.map((data) => (
        <AcceleratorCard
          key={data.id}
          title={data.title}
          image_path={data.image_path}
          stars={Number(data.stars)}
          ratings={data.ratings}
          hours={data.hours}
        />
      ))}
      </div>
    </Box>
  );
};
