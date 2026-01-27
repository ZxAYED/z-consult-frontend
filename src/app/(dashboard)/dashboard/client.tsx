"use client";

import { GlassPanel } from "@/components/shared/glass";
import { cn } from "@/lib/utils";
import { DashboardSummary } from "@/types/dashboard";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  History,
  ListOrdered,
  Users,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface DashboardClientProps {
  data: DashboardSummary | undefined;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  if (!data) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Appointments (Today)"
          value={data.totalAppointmentsToday.toString()}
          subtitle={`${data.completedCount} completed · ${data.pendingCount} pending`}
          icon={<Calendar className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Active Queue"
          value={data.waitingQueueCount.toString()}
          subtitle="Patients currently waiting"
          icon={<ListOrdered className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Staff Status"
          value={data.availableStaffCount.toString()}
          subtitle={`${data.onLeaveStaffCount} on leave · ${data.totalStaff} total`}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="All Time Appointments"
          value={data.totalAppointmentsAllTime.toString()}
          subtitle="Lifetime total records"
          icon={<History className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="All Time Completed"
          value={data.completedAppointmentsAllTime.toString()}
          subtitle="Successfully completed"
          icon={<CheckCircle2 className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Total Services"
          value={data.totalServices.toString()}
          subtitle="Active service types"
          icon={<Activity className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <GlassPanel
          className="md:col-span-2 lg:col-span-4 p-6 border-0 bg-white/80 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)] backdrop-blur-sm"
          variant="soft"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Latest Activity
            </h3>
          </div>
          <div className="space-y-3 pr-2 custom-scrollbar">
            {data.latestActivityLogs.length > 0 ? (
              data.latestActivityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 rounded-xl px-3 py-2 transition-colors hover:bg-white/60 group"
                >
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors shrink-0" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none text-foreground/90">
                      {log.action.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {log.message}
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold whitespace-nowrap bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 px-2.5 py-1 rounded-full">
                    {format(new Date(log.createdAt), "h:mm a")}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No recent activity
              </p>
            )}
          </div>
        </GlassPanel>

        <GlassPanel
          className="md:col-span-2 lg:col-span-3 p-6 border-0 bg-white/80 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)] backdrop-blur-sm"
          variant="soft"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Staff Load</h3>
          </div>
          <div className="space-y-6">
            {data.staffLoadSummary.map((staff) => (
              <StaffLoadItem
                key={staff.staffId}
                name={staff.name}
                role={staff.type}
                count={staff.todayCount}
                max={staff.dailyCapacity}
                status={staff.availability}
              />
            ))}
          </div>
        </GlassPanel>
      </div>
    </motion.div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={item}>
      <GlassPanel
        className="p-6 border-0 bg-white/80 shadow-[0_22px_50px_-40px_rgba(15,23,42,0.25)] backdrop-blur-sm transition-shadow cursor-default relative overflow-hidden group"
        variant="soft"
      >
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </h3>
          <div className="p-2 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="mt-4">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            {subtitle}
          </p>
        </div>
        <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
      </GlassPanel>
    </motion.div>
  );
}

function StaffLoadItem({
  name,
  role,
  count,
  max,
  status,
}: {
  name: string;
  role: string;
  count: number;
  max: number;
  status: string;
}) {
  const percentage = max > 0 ? (count / max) * 100 : 0;

  let statusColor = "bg-emerald-50 text-emerald-700";
  if (status === "ON_LEAVE") statusColor = "bg-lime-50 text-lime-700";
  if (status === "AVAILABLE") statusColor = "bg-emerald-50 text-emerald-700";
  if (status === "BUSY") statusColor = "bg-green-50 text-green-700";

  const displayStatus = status.replace("_", " ");

  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
        {name[0]}
      </div>
      <div className="flex-1 space-y-1.5 min-w-0">
        <div className="flex justify-between items-center">
          <div className="truncate pr-2">
            <p className="text-sm font-medium leading-none truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{role}</p>
          </div>
          <span
            className={cn(
              "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap",
              statusColor,
            )}
          >
            {displayStatus}
          </span>
        </div>
        <div className="h-1.5 w-full bg-emerald-100/70 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              status === "ON_LEAVE" ? "bg-lime-400" : "bg-emerald-500",
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="text-[10px] text-muted-foreground text-right">
          {count} / {max} patients
        </div>
      </div>
    </div>
  );
}
