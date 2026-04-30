import { NextFunction, Request, Response } from "express";
import { StudentService } from "./student.service";


const getAllStudentProfiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query;
        const students = await StudentService.getAllStudentProfiles(query);

        res.status(200).json({
            success: true,
            message: "Students fetched successfully",
            data: students,
        });
    } catch (error: any) {
        next(error);
    }
};

const getMyStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.user?.id;

        const student = await StudentService.getMyStudentProfile(userId as string);

        res.status(200).json({
            success: true,
            message: "Student Profile fetched successfully",
            data: student,
        });
    } catch (error: any) {
        next(error);
    }
};

const getStudentProfileById = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { studentId } = req.params;

        const student = await StudentService.getStudentProfileById(studentId as string);

        res.status(200).json({
            success: true,
            message: "Student fetched successfully",
            data: student,
        });
    } catch (error: any) {
        next(error);
    }
};

const createStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string;
        const result = await StudentService.createStudentProfile(req.body, userId);

        res.status(201).json({
            success: true,
            message: "Student profile created successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
};

const updateStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params?.studentId as string;
        const userId = req.user?.id as string
        const result = await StudentService.updateStudentProfile(req.body, studentId, userId);

        res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: result,
        });
    } catch (error: any) {
        next(error);
    }
}

const deleteStudentProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const studentId = req.params?.studentId as string;
        const userId = req.user?.id as string
        const result = await StudentService.deleteStudentProfile(studentId, userId);

        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
            data: result
        });
    } catch (error: any) {
        next(error);
    }
}



export const StudentController = {
    getAllStudentProfiles,
    getMyStudentProfile,
    getStudentProfileById,
    createStudentProfile,
    updateStudentProfile,
    deleteStudentProfile,
};