import { NextFunction, Request, Response } from "express";
import { TutorService } from "./tutor.service";


const getAllTutorProfiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryParams = req.query;

    const tutors = await TutorService.getAllTutorProfiles(queryParams);

    res.status(200).json({
      success: true,
      message: "Tutors fetched successfully",
      data: tutors,
    });
  } catch (error: any) {
    next(error);
  }
};

const getMyTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userId = req.user?.id;

    const tutor = await TutorService.getMyTutorProfile(userId as string);

    res.status(200).json({
      success: true,
      message: "Tutor Profile fetched successfully",
      data: tutor,
    });
  } catch (error: any) {
    next(error);
  }
};

const getTutorProfileById = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const { tutorId } = req.params;

    const tutor = await TutorService.getTutorProfileById(tutorId as string);

    res.status(200).json({
      success: true,
      message: "Tutor fetched successfully",
      data: tutor,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAvailableDates = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tutorId } = req.params;

    const tutor = await TutorService.getAvailableDates(tutorId as string);

    res.status(200).json({
      success: true,
      message: "Available dates are fetched successfully",
      data: tutor,
    });
  } catch (error: any) {
    next(error);
  }
};

const getAvailableSlotsForDate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tutorId } = req.params;
    const { date } = req.query;

    const tutor = await TutorService.getAvailableSlotsForDate(tutorId as string, date as string);

    res.status(200).json({
      success: true,
      message: "Available slots are fetched successfully",
      data: tutor,
    });
  } catch (error: any) {
    next(error);
  }
};

const createTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const result = await TutorService.createTutorProfile(req.body, userId);

    res.status(201).json({
      success: true,
      message: "Tutor profile created successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
};

const updateTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutorId = req.params?.tutorId as string;
    const userId = req.user?.id as string
    const result = await TutorService.updateTutorProfile(req.body, tutorId, userId);

    res.status(200).json({
      success: true,
      message: "Tutor updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}

const deleteTutorProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tutorId = req.params?.tutorId as string;
    const userId = req.user?.id as string
    const result = await TutorService.deleteTutorProfile(tutorId, userId);

    res.status(200).json({
      success: true,
      message: "Tutor deleted successfully",
      data: result
    });
  } catch (error: any) {
    next(error);
  }
}



export const TutorController = {
  getAllTutorProfiles,
  getMyTutorProfile,
  getTutorProfileById,
  getAvailableDates,
  getAvailableSlotsForDate,
  createTutorProfile,
  updateTutorProfile,
  deleteTutorProfile,
};