"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/DashboardCompoenents/ui/table";
import { cn } from "@/lib/utils";
import {
  MoreHorizontal,
  SearchX,
  Eye,
  Edit2,
  Trash2,
  Loader2,
  Clock,
} from "lucide-react";
import * as Icons from "lucide-react";

import { PaginationControls } from "../ui/pagination-controls";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { useGetTenantsByFolderQuery } from "@/redux/service/tenant";
import { format, formatDistanceToNow } from "date-fns";

interface TenantsTableProps {
  searchTerm: string;
  selectedRows: string[];
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>;
  folderId: number;
}

export function TenantsTable({
  searchTerm,
  selectedRows,
  setSelectedRows,
  folderId,
}: TenantsTableProps) {
  // --- ១. Fetch Data ពី API ---
  const {
    data: tenants = [],
    isLoading,
    isFetching,
  } = useGetTenantsByFolderQuery(folderId, {
    skip: !folderId,
  });

  // --- ២. Dynamic Column Logic (ទាញ Label ធ្វើជា TableHead) ---
  const dynamicLabels = useMemo(() => {
    const labels = new Set<string>();
    tenants.forEach((tenant: any) => {
      tenant.additionalInfo?.forEach((info: any) => {
        if (info.label) labels.add(info.label);
      });
    });
    return Array.from(labels); // ឧទាហរណ៍៖ ["Phone", "Address", ...]
  }, [tenants]);

  // --- ៣. Pagination & Filter State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const filteredData = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return tenants.filter(
      (item: any) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.email.toLowerCase().includes(lowerSearch),
    );
  }, [tenants, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, folderId]);

  if (isLoading || isFetching) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center space-y-4 rounded-xl border border-dashed border-gray-200 bg-white">
        <Loader2 className="size-8 animate-spin text-purple-600" />
        <p className="text-sm text-gray-500">កំពុងទាញយកទិន្នន័យ...</p>
      </div>
    );
  }

  const getTagColor = (tagName: string) => {
    const colors = [
      "bg-[#FEF9C3] text-blue-900 ring-1 ring-[#FDE68A]", // ពណ៌លឿង (Maintenance)
      "bg-[#FFEDD5] text-blue-900 ring-1 ring-[#FED7AA]", // ពណ៌ទឹកក្រូចខ្ចី (Cat Owners)
      "bg-[#FEE2E2] text-blue-900 ring-1 ring-[#FECACA]", // ពណ៌ផ្កាឈូកខ្ចី (Rent Reminder)
      "bg-[#F3E8FF] text-blue-900 ring-1 ring-[#E9D5FF]", // ពណ៌ស្វាយខ្ចី (Old Furnace)
      "bg-[#E0F2FE] text-blue-900 ring-1 ring-[#BAE6FD]", // ពណ៌ខៀវខ្ចី (NY, Park Ave)
      "bg-[#F1F5F9] text-blue-900 ring-1 ring-[#E2E8F0]", // ពណ៌ប្រផេះខ្ចី (No Tags)
    ];

    // បំប្លែង String ទៅជាលេខ (Hash)
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // ជ្រើសរើស Index នៃពណ៌តាមរយៈលេខ Hash
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-4">
      {/* ស្រោបដោយ overflow-x-auto ដើម្បីការពារករណី Column ច្រើនពេក */}
      <div className="overflow-x-auto rounded-xl border border-gray-100 bg-white">
        <Table className="min-w-[1000px]">
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-transparent">
              <TableHead className="w-[50px] pl-6">
                <Checkbox
                  checked={
                    selectedRows.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onCheckedChange={(checked) =>
                    setSelectedRows(
                      checked
                        ? paginatedData.map((t: any) => t.id.toString())
                        : [],
                    )
                  }
                />
              </TableHead>
              <TableHead className="py-4 font-bold text-slate-700">
                Name
              </TableHead>
              <TableHead className="py-4 font-bold text-slate-700">
                Email
              </TableHead>

              {/* --- ៤. បង្ហាញ Dynamic Head តាម Labels ដែលរកឃើញ --- */}
              {dynamicLabels.map((label) => (
                <TableHead
                  key={label}
                  className="py-4 font-bold capitalize text-slate-700"
                >
                  {label}
                </TableHead>
              ))}

              <TableHead className="py-4 font-bold text-slate-700">
                Tags
              </TableHead>
              <TableHead className="py-4 text-center font-bold text-slate-700">
                Creation Date
              </TableHead>
              <TableHead className="pr-6 text-right font-bold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((tenant: any) => (
                <TableRow
                  key={tenant.id}
                  className="group border-b border-gray-50 transition-colors hover:bg-slate-50/30"
                >
                  <TableCell className="pl-6">
                    <Checkbox
                      checked={selectedRows.includes(tenant.id.toString())}
                      onCheckedChange={(checked) => {
                        setSelectedRows((prev) =>
                          checked
                            ? [...prev, tenant.id.toString()]
                            : prev.filter((id) => id !== tenant.id.toString()),
                        );
                      }}
                    />
                  </TableCell>

                  <TableCell className="font-semibold text-slate-900">
                    {tenant.name}
                  </TableCell>

                  <TableCell className="text-sm text-slate-500">
                    {tenant.email}
                  </TableCell>

                  {/* --- ៥. បំពេញទិន្នន័យតាមជួរ Dynamic Column នីមួយៗ --- */}
                  {dynamicLabels.map((label) => {
                    const field = tenant.additionalInfo?.find(
                      (info: any) => info.label === label,
                    );
                    return (
                      <TableCell key={label} className="text-sm text-slate-600">
                        {field ? (
                          field.value
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {tenant.tags?.map((tagString: string, index: number) => {
                        // ១. បំបែក String "IconName:TagName" (ឧទាហរណ៍: "PawPrint:Maintenance")
                        // ប្រសិនបើជា Tag ចាស់ដែលគ្មាន Icon វាជួយការពារ Error ដោយដាក់រូប Tag ជំនួស
                        const [iconName, tagName] = tagString.includes(":")
                          ? tagString.split(":")
                          : ["Tag", tagString];

                        // ២. ទាញយក Component តាមឈ្មោះ IconName
                        const IconComponent =
                          (Icons as any)[iconName] || Icons.Tag;

                        return (
                          <span
                            key={`${tagString}-${index}`}
                            className={cn(
                              "flex items-center gap-1.5 rounded-sm px-2 py-1 text-[13px] font-medium leading-none ",
                              getTagColor(tagName), // ប្រើពណ៌តាមឈ្មោះ Tag
                            )}
                          >
                            <IconComponent className="size-3.5 opacity-80" />
                            {tagName}
                          </span>
                        );
                      })}

                      {/* ករណីគ្មាន Tag */}
                      {(!tenant.tags || tenant.tags.length === 0) && (
                        <span className="rounded-sm bg-[#F1F5F9] px-2.5 py-1 text-[13px] font-medium text-slate-500">
                          No tags
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 text-slate-600">
                      <span className="text-[13px]">
                        {tenant.lastModifiedAt
                          ? format(
                              new Date(tenant.lastModifiedAt),
                              "MMM dd, yyyy",
                            )
                          : "N/A"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-full p-2 hover:bg-slate-100">
                          <MoreHorizontal className="size-5 text-slate-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border-slate-100 shadow-lg"
                      >
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/tenants/${tenant.id}`}
                            className="flex cursor-pointer items-center p-2"
                          >
                            <Eye className="mr-2 size-4 opacity-60" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/tenants/edit/${tenant.id}`}
                            className="flex cursor-pointer items-center p-2"
                          >
                            <Edit2 className="mr-2 size-4 opacity-60" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex cursor-pointer items-center p-2 text-red-600 focus:bg-red-50 focus:text-red-700">
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6 + dynamicLabels.length}
                  className="h-48 text-center"
                >
                  <div className="flex flex-col items-center justify-center opacity-30">
                    <SearchX className="mb-2 size-12" />
                    <p className="text-lg font-medium">មិនមានទិន្នន័យ</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalItems > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={(val) => {
            setRowsPerPage(val);
            setCurrentPage(1);
          }}
          availableRowsPerPage={[7, 10, 20, 50]}
        />
      )}
    </div>
  );
}
