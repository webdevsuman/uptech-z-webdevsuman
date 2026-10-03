"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  getDynamicSearchModules,
  TSearchModule,
} from "@/navigation/sidebar/navbar-items";
import { AppIcon } from "@/components/ui/app-icon";

export const HeaderSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const dynamicModules = useMemo(() => getDynamicSearchModules(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const filteredModules = useMemo(() => {
    if (!searchQuery.trim()) return dynamicModules;
    const q = searchQuery.toLowerCase().trim();
    return dynamicModules.filter(
      (mod) =>
        mod.title.toLowerCase().includes(q) ||
        mod.category.toLowerCase().includes(q)
    );
  }, [dynamicModules, searchQuery]);

  const handleSelectModule = (path: string) => {
    setIsDropdownOpen(false);
    setSearchQuery("");
    router.push(path);
  };

  const isModuleActive = (modulePath: string) => {
    if (!pathname || !modulePath) return false;
    if (pathname === modulePath) return true;
    const basePath = modulePath.replace(/\/list$/, "");
    return basePath !== "/" && pathname.startsWith(basePath);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsDropdownOpen(true);
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={searchContainerRef} className="relative w-full xl:w-[430px]">
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <span className="absolute -translate-y-1/2 left-3.5 top-1/2 pointer-events-none text-gray-500 dark:text-gray-400">
          <AppIcon icon="lucide:search" className="w-4 h-4" />
        </span>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder="Search or type command..."
          className="h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-11 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900/50 dark:text-white/90 dark:placeholder:text-white/30"
        />

        <button
          type="button"
          onClick={() => {
            setIsDropdownOpen(true);
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 cursor-pointer"
        >
          <span>⌘</span>
          <span>K</span>
        </button>
      </form>

      {/* Module Navigation Search Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-theme-lg dark:border-gray-800 dark:bg-gray-900">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Navigation Modules
          </div>
          <div className="max-h-64 overflow-y-auto space-y-1">
            {filteredModules.length > 0 ? (
              filteredModules.map((module: TSearchModule) => {
                const isActive = isModuleActive(module.path);
                return (
                  <button
                    key={module.id}
                    type="button"
                    onClick={() => handleSelectModule(module.path)}
                    className={`flex w-full items-center justify-between px-3 py-2 rounded-lg text-left transition-colors group cursor-pointer ${
                      isActive
                        ? "bg-brand-50/80 dark:bg-brand-500/15 border-l-4 border-brand-500 pl-2"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800/60"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-105 ${
                          isActive
                            ? "bg-brand-500 text-white shadow-xs dark:bg-brand-500 dark:text-white"
                            : "bg-brand-50 text-brand-500 dark:bg-brand-500/10 dark:text-brand-400"
                        }`}
                      >
                        {module.icon}
                      </span>
                      <div className="min-w-0 truncate">
                        <span
                          className={`block text-sm truncate ${
                            isActive
                              ? "font-semibold text-brand-600 dark:text-brand-400"
                              : "font-medium text-gray-800 dark:text-white/90"
                          }`}
                        >
                          {module.title}
                        </span>
                        <span className="block text-xs text-gray-400 dark:text-gray-500">
                          {module.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isActive && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-brand-500/10 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-500/20">
                          Active
                        </span>
                      )}
                      <AppIcon
                        icon="lucide:chevron-right"
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? "text-brand-500 dark:text-brand-400"
                            : "text-gray-400 group-hover:text-brand-500"
                        }`}
                      />
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No matching modules found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderSearch;
