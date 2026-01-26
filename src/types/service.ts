import { StaffType } from "./staff";

export interface Service {
    id: string;
    name: string;
    durationMinutes: number;
    requiredStaffType: StaffType;
    createdAt: string;
    updatedAt: string;
}

export interface CreateServicePayload {
    name: string;
    durationMinutes: number;
    requiredStaffType: StaffType;
}

export interface UpdateServicePayload {
    name?: string;
    durationMinutes?: number;
    requiredStaffType?: StaffType;
}

export interface ServiceResponse {
    success: boolean;
    message: string;
    data: {
        data: Service[];
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
