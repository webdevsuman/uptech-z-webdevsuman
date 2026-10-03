"use client";

import React, { useState } from "react";
import { AppIcon } from "@/components/ui/app-icon";
import Badge from "@/components/ui/badge/Badge";
import { ISection } from "@/api/hooks/course/schema";

interface CurriculumAccordionProps {
  sections?: ISection[];
}

export const CurriculumAccordion: React.FC<CurriculumAccordionProps> = ({
  sections = [],
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "0": true,
  });

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [index.toString()]: !prev[index.toString()],
    }));
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds || seconds <= 0) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!sections.length) {
    return (
      <div className="p-8 text-center border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl bg-gray-50/50 dark:bg-gray-800/30">
        <AppIcon icon="lucide:film" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          No Curriculum Sections Added
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          The instructor has not created sections or lectures for this course yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section, idx) => {
        const isOpen = !!openSections[idx.toString()];
        const lectures = section.lectures || [];

        return (
          <div
            key={section._id || idx}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800/50"
          >
            {/* Section Header */}
            <button
              type="button"
              onClick={() => toggleSection(idx)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/80 transition"
            >
              <div className="flex items-center gap-3">
                <AppIcon
                  icon={isOpen ? "lucide:chevron-down" : "lucide:chevron-right"}
                  className="w-4 h-4 text-gray-500"
                />
                <span className="font-bold text-sm text-gray-800 dark:text-white">
                  Section {idx + 1}: {section.title}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"}
              </span>
            </button>

            {/* Lecture list */}
            {isOpen && (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/60 border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-900/30">
                {lectures.map((lecture, lIdx) => (
                  <div
                    key={lecture._id || lIdx}
                    className="p-3.5 pl-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <AppIcon
                        icon={lecture.video?.url ? "lucide:play-circle" : "lucide:file-text"}
                        className={`w-4 h-4 shrink-0 ${
                          lecture.video?.url ? "text-brand-500" : "text-gray-400"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {lecture.title}
                      </span>
                      {lecture.isPreview && (
                        <Badge variant="light" color="info" size="sm">
                          Free Preview
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 self-end sm:self-auto">
                      {lecture.video?.url && (
                        <a
                          href={lecture.video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-500 transition underline flex items-center gap-1"
                        >
                          <AppIcon icon="lucide:external-link" className="w-3.5 h-3.5" />
                          Watch Video
                        </a>
                      )}
                      <span>{formatDuration(lecture.video?.duration)}</span>
                      {lecture.resources && lecture.resources.length > 0 && (
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-[11px] font-semibold text-gray-700 dark:text-gray-300">
                          {lecture.resources.length} files
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CurriculumAccordion;
