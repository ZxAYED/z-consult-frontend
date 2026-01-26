export enum StaffType {
    DOCTOR = "DOCTOR",
    CONSULTANT = "CONSULTANT",
    SUPPORT_AGENT = "SUPPORT_AGENT",
    OTHER = "OTHER"
}

export enum StaffAvailability {
    AVAILABLE = "AVAILABLE",
    ON_LEAVE = "ON_LEAVE"
}

export interface Staff {
    id: string;
    name: string;
    email: string;
    type: StaffType;
    dailyCapacity: number;
    availability: StaffAvailability;
    contactEmail?: string | null;
    contactPhone?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateStaffPayload {
    name: string;

    type: StaffType;
    dailyCapacity?: number;
    availability?: StaffAvailability;
}

export interface UpdateStaffPayload {
    name?: string;
    type?: StaffType;
    dailyCapacity?: number;
    availability?: StaffAvailability;
}

export interface StaffResponse {
    success: boolean;
    message: string;
    data: {
        data: Staff[];
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
