"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "default" | "destructive";
}

export function ConfirmModalDelete({
  open,
  title,
  description,
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "destructive",
}: ConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] bg-white p-6 rounded-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-full",
              variant === "destructive" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
            )}>
              <AlertTriangleIcon className="size-5" />
            </div>
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="pt-3 text-gray-500 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-6 flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-purple-100 border hover:bg-red-200"
          >
            {isLoading ? "Processing..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}