/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DashboardSummary {
    date: string;
    totalAppointmentsToday: number;
    completedCount: number;
    pendingCount: number;
    waitingQueueCount: number;
    totalStaff: number;
    availableStaffCount: number;
    onLeaveStaffCount: number;
    totalServices: number;
    totalAppointmentsAllTime: number;
    completedAppointmentsAllTime: number;
    staffLoadSummary: StaffLoad[];
    latestActivityLogs: ActivityLog[];
}

export interface ActivityLog {
    id: string;
    action: string;
    message: string;
    metadata: any;
    createdAt: string;
}

export interface StaffLoad {
    staffId: string;
    name: string;
    type: string;
    availability: string;
    todayCount: number;
    dailyCapacity: number;
    label: string;
}

export interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardSummary;
}
