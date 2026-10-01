"use client";

import React, { useMemo } from "react";
import { TableOptions } from "@tanstack/react-table";
import {
  TanstackTable,
  TAppTableFeatures,
} from "@/components/tables/TanstackTable";
import { THomeAsset } from "@/api/hooks/cms/schema";
import Badge from "@/components/ui/badge/Badge";

export type THomeAssetTableItem = THomeAsset & Record<string, unknown>;

export interface HomeAssetsTableProps {
  data: THomeAssetTableItem[];
  isLoading?: boolean;
}

export const HomeAssetsTable: React.FC<HomeAssetsTableProps> = ({
  data,
  isLoading = false,
}) => {
  const columns = useMemo<
    TableOptions<TAppTableFeatures, THomeAssetTableItem>["columns"]
  >(
    () => [
      {
        accessorKey: "section",
        header: () => "Section",
        cell: ({ row }) => (
          <Badge variant="light" color="primary" size="sm">
            {row.original.section}
          </Badge>
        ),
      },
      {
        accessorKey: "title",
        header: () => "Title",
        cell: ({ row }) => (
          <span className="font-medium text-gray-800 dark:text-white/90">
            {row.original.title}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: () => "Description",
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md">
            {row.original.description}
          </span>
        ),
      }
    ],
    []
  );

  return (
    <TanstackTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchPlaceholder="Search assets by section or title..."
      emptyMessage="No homepage assets found."
    />
  );
};

export default HomeAssetsTable;
