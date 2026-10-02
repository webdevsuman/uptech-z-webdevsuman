"use client";
import Hero from "@/ui/Hero";
import dynamic from "next/dynamic";
import FeaturedCourses from "@/ui/components/FeaturedCourses/FeaturedCourses";
import TrendingCourses from "@/ui/components/TrendingCourses/TrendingCourses";
import CategorySection from "@/ui/components/CategorySection/CategorySection";
import { useMemo, useState } from "react";
import CourseList from "@/ui/components/CategorySection/CourseList";
import { CareerAccelerators } from "@/ui/components/CareerAccelerators/CareerAccelerators";
import { useHomeAssets } from "@/hooks/react-query/useHomeAssets";

const SearchBar = dynamic(() => import("@/ui/components/SearchBar/SearchBar"), {
  ssr: false,
});

export default function HomePage() {
  const { data } = useHomeAssets();

  const sectionMap = useMemo(() => {
    return (
      data?.reduce<Record<string, { title: string; description: string }>>(
        (acc, item) => {
          acc[item.section] = {
            title: item.title,
            description: item.description,
          };
          return acc;
        },
        {}
      ) ?? {}
    );
  }, [data]);

  const handleCategorySelect = (categoryId: string) => {
    setFilters((prev) => ({
      ...prev,
      categoryId,
    }));
  };

  //Searchbar
  const [filters, setFilters] = useState({
    search: "",
    categoryId: undefined as string | undefined,
    category: "All",
    rating: "Any",
    price: "All",
    level: "All",
  });

  return (
    <>
      <main>
        {/* Hero */}
        <Hero
          title={sectionMap.hero?.title}
          description={sectionMap.hero?.description}
        />

        {/* Searchbar */}
        <div className="md:px-20 px-5">
          <SearchBar onSearch={(newFilters) => setFilters(newFilters)} />
        </div>

        {/* Career Accelerators */}
        <div className="md:px-20 px-5">
          <CareerAccelerators
            title={sectionMap.career_accelerator?.title}
            description={sectionMap.career_accelerator?.description}
          />
        </div>

        {/* Categories */}
        <div className="md:px-20 px-5">
          <CategorySection
            title={sectionMap.category?.title}
            description={sectionMap.category?.description}
            onSelect={handleCategorySelect}
          />
          <div id="courses" className="py-5">
            <CourseList filters={filters} />
          </div>
        </div>

        {/* Featured Courses */}
        <FeaturedCourses
          title={sectionMap.featured?.title}
          description={sectionMap.featured?.description}
        />

        {/* Trending Courses */}
        <TrendingCourses
          title={sectionMap.trending?.title}
          description={sectionMap.trending?.description}
        />
      </main>
    </>
  );
}
