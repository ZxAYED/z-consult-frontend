/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { PrimaryActionButton } from "@/components/shared/primary-action-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serviceService } from "@/lib/services/service.service";
import { useResourceCache } from "@/providers/resource-cache-provider";
import { Service, ServiceResponse } from "@/types/service";
import { StaffType } from "@/types/staff";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ServicesClientProps {
  initialData: ServiceResponse;
}

export default function ServicesClient({ initialData }: ServicesClientProps) {
  const { refreshServices } = useResourceCache();
  const [services, setServices] = useState<Service[]>(initialData.data.data);
  const [totalPages, setTotalPages] = useState(
    initialData.data.meta.totalPages,
  );
  const [currentPage, setCurrentPage] = useState(
    initialData.data.meta.currentPage,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingServiceId, setDeletingServiceId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [limit] = useState(10);

  const [formData, setFormData] = useState({
    name: "",
    durationMinutes: "30",
    requiredStaffType: "" as StaffType,
  });

  const fetchServices = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await serviceService.getAll(page, limit);
      if (response.success) {
        setServices(response.data.data);
        setTotalPages(response.data.meta.totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error("Failed to fetch services");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchServices(newPage);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.durationMinutes ||
      !formData.requiredStaffType
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const toastId = toast.loading(
      editingService ? "Updating service..." : "Creating service...",
    );
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        durationMinutes: parseInt(formData.durationMinutes),
        requiredStaffType: formData.requiredStaffType,
      };

      if (editingService) {
        await serviceService.update(editingService.id, payload);
        toast.success("Service updated successfully", { id: toastId });
      } else {
        await serviceService.create(payload);
        toast.success("Service created successfully", { id: toastId });
      }
      setIsDialogOpen(false);
      setEditingService(null);
      fetchServices(currentPage);
      await refreshServices();
    } catch (error: any) {
      toast.error(
        error.message ||
          (editingService
            ? "Failed to update service"
            : "Failed to create service"),
        { id: toastId },
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (s: Service) => {
    setEditingService(s);
    setFormData({
      name: s.name,
      durationMinutes: s.durationMinutes.toString(),
      requiredStaffType: s.requiredStaffType,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingServiceId) return;

    const toastId = toast.loading("Deleting service...");
    setIsDeleting(true);
    try {
      await serviceService.delete(deletingServiceId);
      toast.success("Service deleted successfully", { id: toastId });
      fetchServices(currentPage);
      await refreshServices();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete service", { id: toastId });
    } finally {
      setIsDeleting(false);
      setDeletingServiceId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingService(null);
    setFormData({
      name: "",
      durationMinutes: "30",
      requiredStaffType: StaffType.DOCTOR,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Services</h2>
        <PrimaryActionButton onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </PrimaryActionButton>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.25)] overflow-hidden">
        <Table className="border-separate border-spacing-0 [&_th]:border-r-0 [&_td]:border-r-0">
          <TableHeader>
            <TableRow className="bg-white/80 h-12">
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Name
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Duration (mins)
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Required Staff
              </TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="h-32 text-center text-muted-foreground"
                >
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              services.map((s) => (
                <TableRow
                  key={s.id}
                  className="h-16 border-border/40 odd:bg-white/80 even:bg-primary/5"
                >
                  <TableCell className="font-medium text-base px-6">
                    {s.name}
                  </TableCell>
                  <TableCell className="text-base px-6">
                    {s.durationMinutes}
                  </TableCell>
                  <TableCell className="px-6">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {s.requiredStaffType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(s)}
                        className="h-8 w-8 rounded-full bg-white/70 border border-border/60 text-muted-foreground hover:text-primary shadow-sm cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/70 border border-border/60 text-muted-foreground hover:text-red-600 shadow-sm cursor-pointer"
                        onClick={() => setDeletingServiceId(s.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className="cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            handlePageChange(Math.min(currentPage + 1, totalPages))
          }
          disabled={currentPage === totalPages || isLoading}
          className="cursor-pointer"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deletingServiceId}
        onClose={() => setDeletingServiceId(null)}
        onConfirm={handleDelete}
        title="Delete Service"
        description="Are you sure you want to delete this service? This action cannot be undone."
        isDeleting={isDeleting}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingService ? "Edit Service" : "Add Service"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="h-10"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="duration">Duration (mins)</Label>
              <Input
                id="duration"
                type="number"
                min="5"
                max="240"
                value={formData.durationMinutes}
                onChange={(e) =>
                  setFormData({ ...formData, durationMinutes: e.target.value })
                }
                required
                className="h-10"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="staffType">Required Staff Type</Label>
              <Select
                value={formData.requiredStaffType}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    requiredStaffType: v as StaffType,
                  })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select staff type" />
                </SelectTrigger>
                <SelectContent className="z-[200] border-none bg-white">
                  {(Object.values(StaffType) as string[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="h-10 cursor-pointer"
              >
                Cancel
              </Button>
              <PrimaryActionButton
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingService ? "Update" : "Create"}
              </PrimaryActionButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
