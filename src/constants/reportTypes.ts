export const REPORT_TYPES = [
    "overview",
    "users",
    "bookings",
    "reviews",
    "categories",
    "contacts",
] as const;

export type ReportType = (typeof REPORT_TYPES)[number];


export const REPORT_FORMATS = [
    "json",
    "csv",
    "xlsx",
    "pdf",
] as const;

export type ReportFormat = (typeof REPORT_FORMATS)[number];