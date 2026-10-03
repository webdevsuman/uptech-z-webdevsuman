"use client";

import React, { useState } from "react";
import {
  tableFeatures,
  useTable,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  rowSortingFeature,
  createSortedRowModel,
  rowPaginationFeature,
  createPaginatedRowModel,
  columnVisibilityFeature,
  TableOptions,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { AppIcon } from "@/components/ui/app-icon";
import ConfirmationModal, {
  TConfirmModalVariant,
} from "@/components/common/ConfirmationModal";

export interface TableConfirmConfig {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: TConfirmModalVariant;
  onConfirm: () => void | Promise<void>;
}

export interface AppTableMeta {
  confirm: (config: TableConfirmConfig) => void;
}

export const tableAppFeatures = tableFeatures({
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnVisibilityFeature,
  tableMeta: {} as AppTableMeta,
});

export type TAppTableFeatures = typeof tableAppFeatures;

export interface TanstackTableProps<TData extends Record<string, unknown>> {
  columns: TableOptions<TAppTableFeatures, TData>["columns"];
  data: TData[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  emptyMessage?: string;
  extraHeader?: React.ReactNode;
}

export function TanstackTable<TData extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Search...",
  emptyMessage = "No items found.",
  extraHeader,
}: TanstackTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    config: TableConfirmConfig | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    config: null,
    isLoading: false,
  });

  const handleOpenConfirm = (config: TableConfirmConfig) => {
    setConfirmModal({
      isOpen: true,
      config,
      isLoading: false,
    });
  };

  const handleExecuteConfirm = async () => {
    if (!confirmModal.config) return;
    try {
      setConfirmModal((prev) => ({ ...prev, isLoading: true }));
      await confirmModal.config.onConfirm();
    } finally {
      setConfirmModal({
        isOpen: false,
        config: null,
        isLoading: false,
      });
    }
  };

  const table = useTable({
    features: tableAppFeatures,
    columns,
    data,
    meta: {
      confirm: handleOpenConfirm,
    },
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-4">
      {/* Search Input & Extra Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="h-10 pl-9 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-gray-300 text-sm focus:border-brand-500 focus:outline-none w-full transition-all"
            />
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <AppIcon icon="lucide:search" className="w-4 h-4" />
            </div>
          </div>
          {extraHeader}
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-12 text-sm text-gray-500">
              <AppIcon icon="lucide:loader" className="w-6 h-6 animate-spin mr-2" />
              <span>Loading items...</span>
            </div>
          ) : table.getRowModel().rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-sm text-gray-500 gap-2">
              <AppIcon icon="lucide:inbox" className="w-8 h-8 text-gray-400" />
              <span>{emptyMessage}</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort?.() ?? false;
                      const isSorted = header.column.getIsSorted?.();

                      return (
                        <TableCell
                          key={header.id}
                          isHeader
                          className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                        >
                          {header.isPlaceholder ? null : (
                            <div
                              className={`flex items-center gap-1.5 ${
                                canSort
                                  ? "cursor-pointer select-none hover:text-brand-500"
                                  : ""
                              }`}
                              onClick={() =>
                                canSort && header.column.toggleSorting?.()
                              }
                            >
                              <table.FlexRender header={header} />
                              {canSort && (
                                <span className="inline-flex text-xs">
                                  {isSorted === "asc"
                                    ? "▲"
                                    : isSorted === "desc"
                                    ? "▼"
                                    : ""}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-5 py-4 text-sm text-gray-800 dark:text-white/90"
                      >
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {!isLoading && table.getPageCount() > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-theme-xs text-gray-500 dark:text-gray-400">
            Page {table.state.pagination.pageIndex + 1} of {table.getPageCount()}{" "}
            ({table.getFilteredRowModel().rows.length} total)
          </p>
          <Pagination
            currentPage={table.state.pagination.pageIndex + 1}
            totalPages={table.getPageCount()}
            onPageChange={(page) => table.setPageIndex(page - 1)}
          />
        </div>
      )}

      {/* Internal Reusable Confirmation Modal */}
      {confirmModal.config && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.config.title}
          description={confirmModal.config.description}
          confirmText={confirmModal.config.confirmText}
          cancelText={confirmModal.config.cancelText}
          variant={confirmModal.config.variant}
          isLoading={confirmModal.isLoading}
          onClose={() =>
            setConfirmModal({ isOpen: false, config: null, isLoading: false })
          }
          onConfirm={handleExecuteConfirm}
        />
      )}
    </div>
  );
}

export default TanstackTable;
