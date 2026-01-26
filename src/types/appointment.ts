export enum AppointmentStatus {
    SCHEDULED = "SCHEDULED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    PENDING = "PENDING"
}

export interface Appointment {
    id: string;
    // The backend might return customerName or patientName. 
    // Keeping patientName for backward compatibility if backend hasn't changed, 
    // but adding customer details as per new requirement.
    patientName: string; 
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    
    staffId: string;
    staff?: {
        id: string;
        name: string;
    };
    service: string | {
        id: string;
        name: string;
        durationMinutes?: number;
        requiredStaffType?: string;
    };
    startAt?: string; // User used startAt in payload
    startTime: string; // Existing field
    endTime: string;
    status: AppointmentStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAppointmentPayload {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    serviceId: string;
    startAt: string; // ISO 8601
}

export interface UpdateAppointmentPayload {
    customerName?: string;
    customerEmail?: string;
    customerPhone?: string;
    serviceId?: string;
    staffId?: string;
    startAt?: string;
    status?: AppointmentStatus;
}

export interface AppointmentResponse {
    success: boolean;
    message: string;
    data: {
        data: Appointment[];
        meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
            pageItemCount: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        }
    }
}
