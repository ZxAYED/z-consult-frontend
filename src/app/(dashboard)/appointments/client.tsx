/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DeleteConfirmationModal } from "@/components/shared/delete-confirmation-modal";
import { PrimaryActionButton } from "@/components/shared/primary-action-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { appointmentService } from "@/lib/services/appointment.service";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/utils/error-handler";
import { useResourceCache } from "@/providers/resource-cache-provider";
import {
  Appointment,
  AppointmentResponse,
  AppointmentStatus,
  CreateAppointmentPayload,
  UpdateAppointmentPayload,
} from "@/types/appointment";
import { format, isValid } from "date-fns";
import {
  Ban,
  CalendarIcon,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AppointmentsClientProps {
  initialData?: AppointmentResponse;
}

export default function AppointmentsClient({
  initialData,
}: AppointmentsClientProps) {
  const { services, staff, loadingServices, loadingStaff } = useResourceCache();

  const [appointments, setAppointments] = useState<Appointment[]>(
    initialData?.data?.data || [],
  );
  const [loading, setLoading] = useState(!initialData);
  const [totalPages, setTotalPages] = useState(
    initialData?.data?.meta?.totalPages || 1,
  );

  // Filters
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [filterStaffId, setFilterStaffId] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Dialogs
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Form States
  const [formData, setFormData] = useState<
    Partial<CreateAppointmentPayload & UpdateAppointmentPayload>
  >({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    serviceId: "",
    startAt: "",
    staffId: "",
    status: undefined,
  });
  const [formDate, setFormDate] = useState<Date | undefined>(undefined);
  const [formTime, setFormTime] = useState("09:00");

  const isFirstRender = useRef(true);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAll({
        page,
        limit,
        staffId: filterStaffId === "all" ? undefined : filterStaffId,
        status: filterStatus === "all" ? undefined : filterStatus,
        search: debouncedSearchQuery || undefined,
      });
      if (response.success) {
        setAppointments(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If we have initial data, skip the first fetch unless filters change from default
    // But since filters are state, they are default on mount.
    if (initialData && isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchAppointments();
  }, [page, limit, filterStaffId, filterStatus, debouncedSearchQuery]);

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      serviceId: "",
      startAt: "",
      staffId: "",
      status: undefined,
    });
    setFormDate(undefined);
    setFormTime("09:00");
  };

  const handleCreateOpen = () => {
    resetForm();
    setIsCreateOpen(true);
  };

  const handleEditOpen = (appt: Appointment) => {
    let startAtDate = undefined;
    let startAtTime = "09:00";

    if (appt.startTime && isValid(new Date(appt.startTime))) {
      const d = new Date(appt.startTime);
      startAtDate = d;
      startAtTime = format(d, "HH:mm");
    } else if (appt.startAt && isValid(new Date(appt.startAt))) {
      const d = new Date(appt.startAt);
      startAtDate = d;
      startAtTime = format(d, "HH:mm");
    }

    setFormData({
      customerName: appt.customerName || appt.patientName,
      customerEmail: appt.customerEmail || "",
      customerPhone: appt.customerPhone || "",
      serviceId:
        typeof appt.service === "string" ? appt.service : appt.service?.id,
      staffId: appt.staffId || appt.staff?.id || "",
      status: appt.status,
    });
    setFormDate(startAtDate);
    setFormTime(startAtTime);
    setEditingAppointment(appt);
  };

  const handleSave = async () => {
    if (
      !formData.customerName ||
      !formData.serviceId ||
      !formDate ||
      !formTime
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Combine Date and Time
    const combinedDateTime = new Date(formDate);
    const [hours, minutes] = formTime.split(":").map(Number);
    combinedDateTime.setHours(hours, minutes, 0, 0);
    const isoDateTime = combinedDateTime.toISOString();

    try {
      if (editingAppointment) {
        // Update
        const payload: UpdateAppointmentPayload = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          serviceId: formData.serviceId,
          staffId: formData.staffId === "none" ? undefined : formData.staffId, // Handle optional staff
          startAt: isoDateTime,
          status: formData.status,
        };

        // Remove undefined keys
        Object.keys(payload).forEach(
          (key) =>
            (payload as any)[key] === undefined && delete (payload as any)[key],
        );

        const res = await appointmentService.update(
          editingAppointment.id,
          payload,
        );
        if (res.success) {
          toast.success("Appointment updated successfully");
          setEditingAppointment(null);
          fetchAppointments();
        }
      } else {
        // Create
        const payload: CreateAppointmentPayload = {
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          serviceId: formData.serviceId,
          startAt: isoDateTime,
        };
        const res = await appointmentService.create(payload);
        if (res.success) {
          toast.success("Appointment created successfully");
          setIsCreateOpen(false);
          fetchAppointments();
        }
      }
    } catch (error) {
      handleApiError(
        error,
        editingAppointment
          ? "Failed to update appointment"
          : "Failed to create appointment",
      );
    }
  };

  const handleCancel = async () => {
    if (!cancellingId) return;
    try {
      const res = await appointmentService.cancel(cancellingId);
      if (res.success) {
        toast.success("Appointment cancelled successfully");
        fetchAppointments();
      }
    } catch (error: any) {
      handleApiError(error, "Failed to cancel appointment");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="cursor-pointer"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <PrimaryActionButton
            onClick={handleCreateOpen}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> New Appointment
          </PrimaryActionButton>
        </div>
      </div>

      {showFilters && (
        <div className="rounded-2xl border border-white/70 bg-white/70 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.25)] p-4 w-fit max-w-full inline-flex">
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Search
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Customer name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-10 w-[200px] rounded-xl border-border/60 bg-white/80 focus-visible:ring-1 focus-visible:ring-primary/20"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Status
              </Label>
              <Select
                value={filterStatus}
                onValueChange={(v: any) => setFilterStatus(v)}
              >
                <SelectTrigger className="cursor-pointer h-10 w-[150px] rounded-xl border-border/60 bg-white/80">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="z-[200] border-none bg-white">
                  <SelectItem value="all" className="cursor-pointer bg-white ">
                    All Statuses
                  </SelectItem>
                  {Object.values(AppointmentStatus).map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="cursor-pointer border-border/60 bg-white/80"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Staff
              </Label>
              <Select value={filterStaffId} onValueChange={setFilterStaffId}>
                <SelectTrigger className="cursor-pointer h-10 w-[170px] rounded-xl border-border/60 bg-white/80">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent className="z-[200] border-none bg-white">
                  <SelectItem value="all" className="cursor-pointer">
                    All Staff
                  </SelectItem>
                  {staff.map((s) => (
                    <SelectItem
                      key={s.id}
                      value={s.id}
                      className="cursor-pointer"
                    >
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                  setFilterStaffId("all");
                  setPage(1);
                }}
                className="h-10 rounded-full border border-border/60 bg-white/90 px-4 text-xs font-semibold text-foreground/70 hover:text-foreground"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/70 bg-white/70 shadow-[0_18px_45px_-35px_rgba(15,23,42,0.25)] overflow-hidden">
        <Table className="border-separate border-spacing-0 [&_th]:border-r-0 [&_td]:border-r-0">
          <TableHeader>
            <TableRow className="bg-white/80 h-12">
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Date & Time
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Customer
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Service
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground font-semibold">
                Staff
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
                <TableCell colSpan={6} className="h-32 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-muted-foreground"
                >
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow
                  key={appt.id}
                  className="h-16 border-border/40 odd:bg-white/80 even:bg-primary/5"
                >
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <span className="font-medium text-base">
                        {appt.startTime && isValid(new Date(appt.startTime))
                          ? format(new Date(appt.startTime), "MMM d, yyyy")
                          : appt.startAt && isValid(new Date(appt.startAt))
                            ? format(new Date(appt.startAt), "MMM d, yyyy")
                            : "N/A"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {appt.startTime && isValid(new Date(appt.startTime))
                          ? format(new Date(appt.startTime), "h:mm a")
                          : appt.startAt && isValid(new Date(appt.startAt))
                            ? format(new Date(appt.startAt), "h:mm a")
                            : ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-base px-6">
                    <div className="flex flex-col">
                      <span>{appt.customerName || appt.patientName}</span>
                      {appt.customerEmail && (
                        <span className="text-xs text-muted-foreground">
                          {appt.customerEmail}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-base px-6">
                    {typeof appt.service === "string"
                      ? appt.service
                      : appt.service?.name}
                  </TableCell>
                  <TableCell className="text-base px-6">
                    {appt.staff?.name || (
                      <span className="text-muted-foreground italic">
                        Unassigned
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge
                      variant="outline"
                      className="px-3 py-1 text-xs font-semibold border-0 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                    >
                      {appt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-6">
                    <div className="flex justify-end gap-2">
                      {appt.status !== AppointmentStatus.CANCELLED &&
                        appt.status !== AppointmentStatus.COMPLETED && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setCancellingId(appt.id)}
                            title="Cancel Appointment"
                            className="h-8 w-8 rounded-full bg-white/70 border border-border/60 text-muted-foreground hover:text-orange-600 shadow-sm cursor-pointer"
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditOpen(appt)}
                        className="h-8 w-8 rounded-full bg-white/70 border border-border/60 text-muted-foreground hover:text-primary shadow-sm cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog
        open={isCreateOpen || !!editingAppointment}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false);
            setEditingAppointment(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingAppointment ? "Edit Appointment" : "New Appointment"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  value={formData.customerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, customerEmail: e.target.value })
                  }
                  placeholder="john@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="customerPhone">Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, customerPhone: e.target.value })
                  }
                  placeholder="+123..."
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="service">Service *</Label>
              <Select
                value={formData.serviceId}
                onValueChange={(v) =>
                  setFormData({ ...formData, serviceId: v })
                }
              >
                <SelectTrigger id="service" className="cursor-pointer">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent className="z-[200] border-none bg-white">
                  {loadingServices ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : (
                    services.map((s) => (
                      <SelectItem
                        key={s.id}
                        value={s.id}
                        className="cursor-pointer"
                      >
                        {s.name} ({s.durationMinutes} min)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal cursor-pointer",
                        !formDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 " />
                      {formDate ? (
                        format(formDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[200]" align="start">
                    <Calendar
                      mode="single"
                      selected={formDate}
                      onSelect={setFormDate}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  className="cursor-pointer"
                />
              </div>
            </div>

            {/* Staff selection is only available in Edit mode */}
            {editingAppointment && (
              <div className="grid gap-2">
                <Label htmlFor="staff">Staff (Optional)</Label>
                <Select
                  value={formData.staffId || "none"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, staffId: v })
                  }
                >
                  <SelectTrigger id="staff" className="cursor-pointer">
                    <SelectValue placeholder="Select staff" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] border-none bg-white">
                    <SelectItem
                      value="none"
                      className="cursor-pointer text-muted-foreground"
                    >
                      Unassigned
                    </SelectItem>
                    {loadingStaff ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        Loading...
                      </div>
                    ) : (
                      staff.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={s.id}
                          className="cursor-pointer"
                        >
                          {s.name} ({s.type})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {editingAppointment && (
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v: any) =>
                    setFormData({ ...formData, status: v })
                  }
                >
                  <SelectTrigger id="status" className="cursor-pointer">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="z-[200] border-none bg-white">
                    {Object.values(AppointmentStatus).map((s) => (
                      <SelectItem key={s} value={s} className="cursor-pointer">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateOpen(false);
                setEditingAppointment(null);
              }}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <PrimaryActionButton onClick={handleSave}>
              {editingAppointment ? "Save Changes" : "Create Appointment"}
            </PrimaryActionButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationModal
        isOpen={!!cancellingId}
        onClose={() => setCancellingId(null)}
        onConfirm={handleCancel}
        title="Cancel Appointment"
        description="Are you sure you want to cancel this appointment? This will free up the slot."
        confirmText="Cancel Appointment"
      />
    </div>
  );
}
