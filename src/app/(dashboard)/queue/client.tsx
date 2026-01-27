/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PrimaryActionButton } from "@/components/shared/primary-action-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { queueService } from "@/lib/services/queue.service";
import { handleApiError } from "@/lib/utils/error-handler";
import { QueueItem } from "@/types/queue";
import { differenceInMinutes, formatDistanceToNow } from "date-fns";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface QueueClientProps {
  initialData?: QueueItem[];
}

export default function QueueClient({ initialData }: QueueClientProps) {
  const [queue, setQueue] = useState<QueueItem[]>(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [assigning, setAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await queueService.getQueue();
      if (response.success) {
        setQueue(response.data);
      }
    } catch (error: any) {
      handleApiError(error, "Failed to fetch queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) return;
    fetchQueue();
  }, []);

  const handleAssign = async () => {
    setAssigning(true);
    try {
      const response = await queueService.assignNext();
      if (response.success) {
        const customerName =
          response.data.appointment?.customerName ||
          response.data.queueItem?.appointment?.customerName ||
          "Patient";
        toast.success(`Assigned: ${customerName}`);
        fetchQueue();
      }
    } catch (error: any) {
      handleApiError(error, "Failed to assign queue item");
    } finally {
      setAssigning(false);
    }
  };

  const totalWaiting = queue.length;

  const filteredQueue = queue.filter(
    (item) =>
      (item.appointment.customerName || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      item.appointment.service.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const sortedQueue = [...filteredQueue].sort(
    (a, b) => new Date(a.queuedAt).getTime() - new Date(b.queuedAt).getTime(),
  );

  const longestWait =
    sortedQueue.length > 0
      ? differenceInMinutes(new Date(), new Date(sortedQueue[0].queuedAt))
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold tracking-tight">Queue Management</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full sm:w-[200px] rounded-xl border-border/60 bg-white/80 focus-visible:ring-1 focus-visible:ring-primary/20"
            />
          </div>
          <PrimaryActionButton
            onClick={handleAssign}
            disabled={assigning || queue.length === 0}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            {assigning ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Assign From Queue
          </PrimaryActionButton>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 !border-0 bg-white/80 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)]">
          <CardHeader>
            <CardTitle>Active Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="sm:hidden space-y-3">
              {loading ? (
                <div className="rounded-2xl bg-white/70 p-6 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
              ) : sortedQueue.length === 0 ? (
                <div className="rounded-2xl bg-white/70 p-6 text-center text-muted-foreground">
                  No patients in queue
                </div>
              ) : (
                sortedQueue.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-white/80 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.2)] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">
                          #{item.position} ·{" "}
                          {item.appointment.customerName || "Guest"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.appointment.service.name}
                        </p>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 border-0">
                        {item.status}
                      </Badge>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground">
                      Queued{" "}
                      {formatDistanceToNow(new Date(item.queuedAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="hidden sm:block">
              <Table className="min-w-[640px] w-full border-none bg-white/0">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Position</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Queued</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    </TableCell>
                  </TableRow>
                ) : sortedQueue.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No patients in queue
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedQueue.map((item) => (
                    <TableRow
                      key={item.id}
                      className="odd:bg-white/80 even:bg-primary/5"
                    >
                      <TableCell className="font-medium text-lg">
                        #{item.position}
                      </TableCell>
                      <TableCell>
                        {item.appointment.customerName || "Guest"}
                      </TableCell>
                      <TableCell>{item.appointment.service.name}</TableCell>
                      <TableCell>
                        {formatDistanceToNow(new Date(item.queuedAt), {
                          addSuffix: true,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 border-0">
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="!border-0 bg-white/80 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)]">
          <CardHeader>
            <CardTitle>Queue Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 border-none">
            <div className="text-center p-4 rounded-xl bg-white/90 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.2)]">
              <div className="text-sm text-muted-foreground">Longest Wait</div>
              <div className="text-3xl font-bold text-slate-900">
                {longestWait} min
              </div>
            </div>
            <div className="text-center p-4 rounded-xl bg-white/90 shadow-[0_10px_25px_-20px_rgba(15,23,42,0.2)]">
              <div className="text-sm text-muted-foreground">Total Waiting</div>
              <div className="text-3xl font-bold text-slate-900">
                {totalWaiting}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
