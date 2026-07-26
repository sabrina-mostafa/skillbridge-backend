export const SESSION_STATUS = {
    UPCOMING: "UPCOMING",
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED",
    MISSED: "MISSED",
    CANCELLED: "CANCELLED",
} as const;

export type SessionStatus = (typeof SESSION_STATUS)[keyof typeof SESSION_STATUS];