export const AVAILABILITY_STATUS = {
    AVAILABLE: "AVAILABLE",
    PARTIAL: "PARTIAL",
    FULL: "FULL",
    UNAVAILABLE: "UNAVAILABLE",
} as const;

export type AvailabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS];
