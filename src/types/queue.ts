export enum QueueStatus {
    ACTIVE = "ACTIVE",
    ASSIGNED = "ASSIGNED",
    CANCELLED = "CANCELLED"
}

export interface QueueItem {
    id: string;
    position: number;
    appointmentId: string;
    status: QueueStatus;
    queuedAt: string;
    appointment: {
        id: string;
        customerName?: string;
        patientName: string; // fallback
        status: string;
        startAt: string;
        endAt: string;
        service: {
            id: string;
            name: string;
            requiredStaffType: string;
        };
    };
    waitTime?: string; // Derived or returned? User example shows "Est. Wait" in table but not in JSON. I'll calculate it or just show queuedAt.
}

export interface QueueResponse {
    success: boolean;
    message: string;
    data: QueueItem[];
}

export interface AssignQueueResponse {
    success: boolean;
    message: string;
    data: {
        appointment: any;
        queueItem: any;
        assignedStaff: any;
        log: any;
    };
}
