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
import { MoreHorizontal, Edit2, Trash2, SearchX, Eye } from "lucide-react";

import { PaginationControls } from "../ui/pagination-controls";
import { ConfirmDeleteModal } from "../EventCompoents/ConfirmDeleteModal";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import TableSkeleton from "../skeletons/TableSkeleton";
import {
  useDeleteEventByUuidMutation,
  useGetMyEventQuery,
} from "@/redux/service/organizer";

interface EventTableProps {
  visibleColumns: Record<string, boolean>;
  searchTerm: string;
  onExportDataChange: (data: any[]) => void;
}

export function EventTable({
  visibleColumns,
  searchTerm,
  onExportDataChange,
}: EventTableProps) {
  const { toast } = useToast();

  // 1. ទាញយកទិន្នន័យពី RTK Query
  const { data: events, isLoading, isError } = useGetMyEventQuery();
  const [deleteEvent, { isLoading: isDeleting }] =
    useDeleteEventByUuidMutation();
  console.log("Event Data:", events);

  const [deleteUuid, setDeleteUuid] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  // 2. Filter Logic
  const filteredData = useMemo(() => {
    if (!events) return [];
    const lowerCaseSearch = searchTerm.toLowerCase();

    return events.filter((item) => {
      return (
        item.title.toLowerCase().includes(lowerCaseSearch) ||
        item.categoryName.toLowerCase().includes(lowerCaseSearch) ||
        item.location_name.toLowerCase().includes(lowerCaseSearch)
      );
    });
  }, [events, searchTerm]);

  // 3. Pagination Logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);

  // Sync data សម្រាប់ Export (CSV/Excel)
  useEffect(() => {
    onExportDataChange(
      filteredData.map((item) => ({
        UUID: item.uuid,
        Title: item.title,
        Category: item.categoryName,
        StartDate: item.start_date,
        Location: item.location_name,
        createdAt: item.createdAt,
      })),
    );
  }, [filteredData, onExportDataChange]);

  // Reset ទៅទំព័រទី 1 ពេល Search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deleteUuid) return;

    try {
      await deleteEvent({ uuid: deleteUuid }).unwrap();

      toast({
        title: "Success",
        description: "Event deleted successfully",
        className: "bg-green-600 text-white",
      });

      setDeleteUuid(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
      console.log("Delete error:", error);
    }
  };


  const formatTime = (time: string) => {
    if (!time) return "";

    const date = new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  

  if (isLoading) return <TableSkeleton />;
  if (isError)
    return (
      <div className="p-10 text-center text-red-500">
        មានបញ្ហាក្នុងការផ្ទុកទិន្នន័យព្រឹត្តិការណ៍
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="rounded-[10px] border bg-white dark:border-dark-3 dark:bg-gray-dark">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-[#F7F9FC] dark:bg-dark-2">
              <TableHead className="xl:pl-7.5">Event Details</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>CreatedAt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right xl:pr-7.5">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((event) => (
                <TableRow
                  key={event.uuid}
                  className="border-[#eee] dark:border-dark-3"
                >
                  {/* Event Name & Image */}
                  <TableCell className="xl:pl-7.5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image
                          unoptimized
                          src={event.image || "/imageplaceholder.png"}
                          alt={event.title}
                          width={1000}
                          height={1000}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="mb-0.5 line-clamp-1 font-medium text-dark dark:text-white">
                          {event.title}
                        </span>
                        <div className="flex space-x-1 text-xs text-gray-500">
                          <div>Event start :{"  "}</div>
                          <div className="text-dark dark:text-white">
                            {" "}
                            {new Date(event.start_date)
                              .toLocaleDateString("en-GB")
                              .replace(/\//g, "-")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-sm px-3 py-1 text-xs font-medium uppercase",
                        // Dynamic background and text colors based on Category
                        event.categoryName === "CONFERENCE" &&
                          "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-500",
                        event.categoryName === "CONCERT" &&
                          "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-500",
                        event.categoryName === "SPORT" &&
                          "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-500",
                        event.categoryName === "WORKSHOP" &&
                          "bg-teal-100 text-teal-700 dark:bg-teal-500/10 dark:text-teal-500",
                        // Default fallback if category doesn't match
                        ![
                          "CONFERENCE",
                          "CONCERT",
                          "SPORT",
                          "WORKSHOP",
                        ].includes(event.categoryName) &&
                          "bg-gray-100 text-gray-700",
                      )}
                    >
                      {event.categoryName}
                    </span>
                  </TableCell>

                  {/* Date */}
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-dark dark:text-white">
                        {new Date(event.start_date)
                          .toLocaleDateString("en-GB")
                          .replace(/\//g, "-")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </p>
                    </div>
                  </TableCell>

                  {/* Location */}
                  <TableCell>
                    <p className="max-w-[150px] truncate text-sm text-dark dark:text-white">
                      {event.location_name}
                    </p>
                  </TableCell>

                  {/* createdAt */}
                  <TableCell>
                    <p className="font-medium text-dark dark:text-white">
                      {new Date(event.createdAt)
                        .toLocaleDateString("en-GB")
                        .replace(/\//g, "-")}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </TableCell>

                  {/* status */}
                  <TableCell>
                    <span
                      className={cn(
                        "inline-flex rounded-sm px-3 py-1 text-xs font-medium",
                        event.status
                          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-500"
                          : "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-500",
                      )}
                    >
                      {event.status ? "Active" : "Inactive"}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right xl:pr-7.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-dark-3">
                          <MoreHorizontal className="size-5 text-gray-500" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/events/${event.uuid}`}
                            className="flex cursor-pointer items-center"
                          >
                            <Eye className="mr-2 size-4" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/events/edit/${event.uuid}`}
                            className="flex cursor-pointer items-center"
                          >
                            <Edit2 className="mr-2 size-4" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteUuid(event.uuid)}
                          className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
                        >
                          <Trash2 className="mr-2 size-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-[300px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <SearchX className="size-10 text-gray-300" />
                    <p className="text-gray-500">រកមិនឃើញព្រឹត្តិការណ៍ឡើយ</p>
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

      <ConfirmDeleteModal
        open={deleteUuid !== null}
        onCancel={() => setDeleteUuid(null)}
        onConfirm={handleConfirmDelete}
        
      />
    </div>
  );
}
