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
import { staffService } from "@/lib/services/staff.service";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/utils/error-handler";
import { useResourceCache } from "@/providers/resource-cache-provider";
import {
  CreateStaffPayload,
  Staff,
  StaffAvailability,
  StaffResponse,
  StaffType,
} from "@/types/staff";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface StaffClientProps {
  initialData?: StaffResponse;
}

export default function StaffClient({ initialData }: StaffClientProps) {
  const { refreshStaff } = useResourceCache();
  const [staff, setStaff] = useState<Staff[]>(initialData?.data?.data || []);
  const [loading, setLoading] = useState(!initialData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    initialData?.data?.meta?.totalPages || 1,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<CreateStaffPayload>({
    name: "",
    type: StaffType.DOCTOR,
    dailyCapacity: 5,
    availability: StaffAvailability.AVAILABLE,
  });

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await staffService.getAll(page);
      if (response.success) {
        setStaff(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we have initial data and it's the first page, we might want to skip fetch
    // But since pagination is state, and initialData is for page 1...
    // If page is 1 and we have initialData, we could skip.
    // However, simplest is to just fetch when page changes.
    // If initialData is present, we don't need to fetch on mount if page is 1.
    if (initialData && page === 1 && staff.length > 0) {
      // Assume initial data is fresh enough for now, or just let it re-fetch if we want absolute freshness
      // But to avoid double fetch on mount:
      // We need a ref to track if it's the first render
      return;
    }
    fetchStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading(
      editingStaff ? "Updating staff..." : "Creating staff...",
    );

    try {
      if (editingStaff) {
        const response = await staffService.update(editingStaff.id, {
          name: formData.name,
          type: formData.type,
          dailyCapacity: formData.dailyCapacity,
          availability: formData.availability,
        });
        if (response.success)
          toast.success("Staff updated successfully", { id: toastId });
      } else {
        const response = await staffService.create(formData);
        if (response.success)
          toast.success("Staff created successfully", { id: toastId });
      }
      setIsDialogOpen(false);
      setEditingStaff(null);
      fetchStaff();
      await refreshStaff();
    } catch (error: any) {
      // toast.loading returns an ID that we need to dismiss or update
      // toast.error will show a new toast. We should dismiss the loading one.
      toast.dismiss(toastId);
      handleApiError(error, "Operation failed");
    }
  };

  const handleEdit = (s: Staff) => {
    setEditingStaff(s);
    setFormData({
      name: s.name,
      type: s.type,
      dailyCapacity: s.dailyCapacity,
      availability: s.availability,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deletingStaffId) return;

    const toastId = toast.loading("Deleting staff...");
    setIsDeleting(true);
    try {
      const response = await staffService.delete(deletingStaffId);
      if (response.success) {
        toast.success("Staff deleted successfully", { id: toastId });
        fetchStaff();
        await refreshStaff();
      }
    } catch (error) {
      toast.dismiss(toastId);
      handleApiError(error, "Failed to delete staff");
    } finally {
      setIsDeleting(false);
      setDeletingStaffId(null);
    }
  };

  const openCreateDialog = () => {
    setEditingStaff(null);
    setFormData({
      name: "",

      type: StaffType.DOCTOR,
      dailyCapacity: 5,
      availability: StaffAvailability.AVAILABLE,
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Staff Management</h2>
        <PrimaryActionButton onClick={openCreateDialog} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </PrimaryActionButton>
      </div>

      <div className="sm:hidden space-y-3">
        {loading ? (
          <div className="rounded-2xl bg-white/70 p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          </div>
        ) : staff.length === 0 ? (
          <div className="rounded-2xl bg-white/70 p-6 text-center text-muted-foreground">
            No staff members found
          </div>
        ) : (
          staff.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl bg-white/80 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.email}</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                  {s.type.replace("_", " ")}
                </span>
              </div>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Capacity</span>
                  <span>{s.dailyCapacity}/day</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-muted-foreground">Status</span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                      s.availability === "AVAILABLE"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                        : "bg-lime-50 text-lime-700 ring-lime-600/20",
                    )}
                  >
                    {s.availability.replace("_", " ")}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(s)}
                  className="rounded-full bg-white/70 px-3 text-muted-foreground hover:text-primary shadow-sm"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeletingStaffId(s.id)}
                  className="rounded-full bg-white/70 px-3 text-muted-foreground hover:text-red-600 shadow-sm"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden sm:block rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.25)] overflow-hidden">
        <Table className="min-w-[720px] border-separate border-spacing-0 [&_th]:border-r-0 [&_td]:border-r-0">
          <TableHeader>
            <TableRow className="bg-white/80 h-12">
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Name
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Role
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Capacity
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Status
              </TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : staff.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-32 text-center text-muted-foreground"
                >
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              staff.map((s) => (
                <TableRow
                  key={s.id}
                  className="h-16 border-border/40 odd:bg-white/80 even:bg-primary/5"
                >
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-base">{s.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {s.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      {s.type.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-base px-6">
                    {s.dailyCapacity}/day
                  </TableCell>
                  <TableCell className="px-6">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                        s.availability === "AVAILABLE"
                          ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                          : "bg-lime-50 text-lime-700 ring-lime-600/20",
                      )}
                    >
                      {s.availability.replace("_", " ")}
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
                        onClick={() => setDeletingStaffId(s.id)}
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

      <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="cursor-pointer w-full sm:w-auto"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="cursor-pointer w-full sm:w-auto"
        >
          Next
        </Button>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deletingStaffId}
        onClose={() => setDeletingStaffId(null)}
        onConfirm={handleDelete}
        title="Delete Staff"
        description="Are you sure you want to delete this staff member? This action cannot be undone."
        isDeleting={isDeleting}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingStaff ? "Edit Staff" : "Add Staff"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="type">Role</Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) =>
                    setFormData({ ...formData, type: v as StaffType })
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select role" />
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
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="capacity">Daily Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.dailyCapacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dailyCapacity: parseInt(e.target.value),
                    })
                  }
                  required
                  className="h-10"
                />
              </div>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Select
                value={formData.availability}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    availability: v as StaffAvailability,
                  })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="z-[200] border-none bg-white">
                  {(Object.values(StaffAvailability) as string[]).map(
                    (status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("_", " ")}
                      </SelectItem>
                    ),
                  )}
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
              <PrimaryActionButton type="submit" className="cursor-pointer">
                {editingStaff ? "Update" : "Create"}
              </PrimaryActionButton>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
