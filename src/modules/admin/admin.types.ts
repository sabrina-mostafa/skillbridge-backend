import { Status } from "../../../generated/prisma/enums";
import { ReportType } from "../../constants/reportTypes";
import { UserRoles } from "../../constants/userRoles";

export type GetAllUsersQuery = {
    searchTerm?: string;   // name/email
    role?: UserRoles;
    isFeatured: "true" | "false";
    status?: Status;
    page?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    sortOrder?: string;
}

export type GetAllMessagesQuery = {
    searchTerm?: string;
    userType?: string;
    inquiryType?: string;
    page?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
};

export type GetReportQuery = {
    type: ReportType;
    from?: string;
    to?: string;
    format?: "json" | "csv" | "xlsx" | "pdf";
};