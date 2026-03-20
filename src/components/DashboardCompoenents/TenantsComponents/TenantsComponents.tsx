"use client";
import Image from "next/image";
import React, { useState } from "react";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import HeaderEvent from "../EventCompoents/header-event/HeaderEvent";
import { ColumnToggleDropdown } from "../ui/ColumnToggleDropdown";
import { TenantsTable } from "../Tables/TenantsTable";
import { LuFileDown, LuFileUp, LuSlidersHorizontal } from "react-icons/lu";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import { useParams } from "next/navigation";
import { AddTenantDialog } from "./AddTenantDialog";
import { useDeleteMultipleTenantsMutation, useUpdateMultipleTenantsTagsMutation } from "@/redux/service/tenant";
import { useToast } from "@/hooks/use-toast";
import { ConfirmModalDelete } from "../Layouts/sidebar/ConfirmModalDelete";
import { EditTagsModal } from "./EditTagsModal";

export default function TenantsComponents() {
  const params = useParams();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  // ១. ចាប់យក folderId ពី URL Parameters (ឧទាហរណ៍៖ /folders/[id])
  const folderId = params.id ? Number(params.id) : 0;
  const { toast } = useToast();
  // ២. State សម្រាប់ Search និង Selection
  const [searchTerm, setSearchTerm] = useState("");

  // State to manage column visibility (Matching the image)
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [exportData, setExportData] = useState<any[]>([]);
  const [columnVisibility, setColumnVisibility] = useState({
    ID: true,
    Name: true,
    Image: true,
    StockStatus: true,
    UnitPrice: true,
    Actions: true,
  });

  const [deleteMultiple, { isLoading: isDeleting }] = useDeleteMultipleTenantsMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // --- អនុគមន៍សម្រាប់លុបពិតប្រាកដ (ហៅចេញពី Modal) ---
  const handleConfirmBulkDelete = async () => {
    try {
      const idsToDelete = selectedRows.map((id) => Number(id));
      await deleteMultiple(idsToDelete).unwrap();

      toast({
        title: "លុបបានជោគជ័យ 🎉",
        description: `អតិថិជនចំនួន ${selectedRows.length} នាក់ត្រូវបានលុបចេញពីប្រព័ន្ធ។`,
      });
      
      setSelectedRows([]); // សម្អាត Selection
    } catch (error) {
      toast({
        title: "មានបញ្ហា",
        description: "មិនអាចលុបទិន្នន័យបានទេ សូមព្យាយាមម្តងទៀត។",
        variant: "destructive",
      });
    } finally {
      setShowDeleteModal(false); // បិទ Modal
    }
  };


  const [updateTags, { isLoading: isUpdatingTags }] = useUpdateMultipleTenantsTagsMutation();
  const [showTagModal, setShowTagModal] = useState(false);

  const handleConfirmEditTags = async (newTags: string[]) => {
    try {
      const ids = selectedRows.map((id) => Number(id));
      await updateTags({ ids, tags: newTags }).unwrap();

      toast({
        title: "Tags Updated! 🏷️",
        description: `បានប្តូរ Tags សម្រាប់អតិថិជនចំនួន ${selectedRows.length} នាក់។`,
      });
      
      setSelectedRows([]); // សម្អាត Selection
      setShowTagModal(false); // បិទ Modal
    } catch (error) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Action & Search */}
        <div className="flex flex-1 items-center gap-3">
          <button
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
          >
            <IoMdAdd className="text-xl" />
            <span>Add Tenant</span>
          </button>

          <div className="relative w-full max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <IoMdSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full rounded-lg border border-gray-200 bg-white p-2 pl-10 text-sm focus:border-purple-500 focus:ring-purple-500"
              placeholder="Search"
            />
          </div>
        </div>

        {/* Right Side: Filters & Selection Actions */}
        <div className="flex items-center gap-2">
          {/* Always show Filters button */}
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LuFileUp className="size-4" />
            <span>Import</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            <LuFileDown className="size-4" />
            <span>Export</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
          >
            <span>Filters</span>
            <LuSlidersHorizontal className="h-4 w-4" />
          </button>

          {/* Conditionally show Selection Actions next to Filters */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-2 border-gray-200 animate-in fade-in slide-in-from-right-2 dark:border-gray-700">
              <span className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-purple-600">
                {selectedRows.length} Selected
              </span>

              <button onClick={() => setShowTagModal(true)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700">
                <FiEdit3 className="size-4" />
                Edit tags
              </button>

              <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700">
                <FiTrash2 className="size-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-100">
        <div className="space-y-4 rounded-lg bg-white p-3">
          {/* Stats Header Section */}
          <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 md:grid-cols-4">
            {/* Total Projects */}
            <div className="space-y-3 border-r border-dashed border-gray-200 pr-4 dark:border-gray-700">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                Total Projects
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  12
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-green-50 px-2 py-1 text-[12px] text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] text-white">
                  ✓
                </span>
                66% Active, 25% Completed, 8% Overdue
              </div>
            </div>

            {/* Projects By Phase */}
            <div className="space-y-3 border-r border-dashed border-gray-200 px-4 dark:border-gray-700">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                Projects By Phase
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  10
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-2 py-1 text-[12px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <span className="text-gray-900 dark:text-white">🕒</span>
                Planing: 3, Design: 5, Review: 3
              </div>
            </div>

            {/* Team Workload */}
            <div className="space-y-3 border-r border-dashed border-gray-200 px-4 dark:border-gray-700">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                Team Workload
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  50 tasks
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-2 py-1 text-[12px] text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <span>⌛</span>
                40% Completed
              </div>
            </div>

            {/* Total Budget */}
            <div className="space-y-3 pl-4">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
                Total Budget{" "}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  £150,000
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-2 py-1 text-[12px] text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                <span>⚡</span>
                Spent £150,000
              </div>
            </div>
          </div>
          <TenantsTable
            folderId={folderId}
            searchTerm={searchTerm}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
          />
        </div>
      </div>
      <AddTenantDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        folderId={folderId}
      />
      {/* បញ្ចូល ConfirmModalDelete ទៅក្នុង Component របស់អ្នក */}
      <ConfirmModalDelete
        open={showDeleteModal}
        title={`តើអ្នកពិតជាចង់លុបអតិថិជនទាំង ${selectedRows.length} នាក់នេះមែនទេ?`}
        description="សកម្មភាពនេះមិនអាចត្រឡប់ថយក្រោយវិញបានទេ។ រាល់ទិន្នន័យរបស់អតិថិជនទាំងនេះនឹងត្រូវលុបចេញពី Server ជាស្ថាពរ។"
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowDeleteModal(false)}
        
        // isLoading={isDeleting} // បើ ConfirmModal របស់អ្នកមាន props នេះ គឺកាន់តែល្អ
      />
      <EditTagsModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onConfirm={handleConfirmEditTags}
        selectedCount={selectedRows.length}
        isUpdating={isUpdatingTags}
      />
    </div>
  );
}
