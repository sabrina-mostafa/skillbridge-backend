import { NextFunction, Request, Response } from "express";
import { AdminService } from "./admin.service";
import { GetAllUsersQuery, GetReportQuery } from "./admin.types";
import { ReportFormat, ReportType } from "../../constants/reportTypes";
import { generateCSV } from "../../utils/reports/exportCsv";
import { generateExcel } from "../../utils/reports/exportExcel";
import { generatePDF } from "../../utils/reports/exportPdf";


const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        const query = req.query as GetAllUsersQuery;

        const result = await AdminService.getAllUsers(adminId as string, query);

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const getPlatformAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await AdminService.getPlatformAnalytics();

        res.status(200).json({
            success: true,
            message: "Platform analytics fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id;
        const { userId } = req.params;
        const { status } = req.body;

        const result = await AdminService.updateUserStatus(
            adminId as string,
            userId as string,
            status
        );

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateTutorFeatured = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminId = req.user?.id;
        const { tutorId } = req.params;
        const { isFeatured } = req.body;

        const result = await AdminService.updateTutorFeatured(
            adminId as string,
            tutorId as string,
            Boolean(isFeatured)
        );

        res.status(200).json({
            success: true,
            message: "Tutor featured status updated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};


const createContactMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AdminService.createContactMessage(req.body);

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// Admin only
const getAllMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const query = req.query;
        const result = await AdminService.getAllMessages(userId as string, query);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteMessage = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminId = req.user?.id;
        const { messageId } = req.params;


        const result =
            await AdminService.deleteMessage(
                adminId as string,
                messageId as string
            );


        res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

const getReports = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminId = req.user?.id;

        const result = await AdminService.getReports(
            adminId as string,
            req.query as GetReportQuery
        );

        res.status(200).json({
            success: true,
            message: "Report generated successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const generateReport = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { type } = req.params;
        const { from, to, format = "json" } = req.query;

        const report = await AdminService.generateReport(
            req.user!.id,
            type as ReportType,
            {
                ...(from && { from: String(from) }),
                ...(to && { to: String(to) }),
            }
        );

        // ---------------- JSON ----------------
        if (format === "json") {
            return res.status(200).json({
                success: true,
                message: `${type} report generated successfully`,
                data: report,
            });
        }

        // ---------------- CSV ----------------
        if (format === "csv") {
            const rows = Array.isArray(report?.data)
                ? report.data
                : [report?.data];

            const csv = generateCSV(rows);

            res.setHeader("Content-Type", "text/csv");

            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${type}-report.csv`
            );

            return res.send(csv);
        }

        // ---------------- Excel ----------------
        if (format === "xlsx") {
            const rows = Array.isArray(report?.data)
                ? report.data
                : [report?.data];

            const buffer =
                await generateExcel(
                    `${type} Report`,
                    rows
                );

            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );

            res.setHeader(
                "Content-Disposition",
                `attachment; filename=${type}-report.xlsx`
            );

            return res.send(buffer);
        }

        // ---------------- PDF ----------------
        if (format === "pdf") {
            return generatePDF(
                `${type} Report`,
                report,
                res
            );
        }
    } catch (error) {
        next(error);
    }
};


export const AdminController = {
    getAllUsers,
    getPlatformAnalytics,
    updateUserStatus,
    updateTutorFeatured,
    createContactMessage,
    getAllMessages,
    deleteMessage,
    getReports,
    generateReport,
};