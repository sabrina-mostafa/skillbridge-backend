import { NextFunction, Request, Response } from "express";
import { UserService } from "./user.service";



const updateUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string
    const result = await UserService.updateUserRole(userId, req.body);

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}

const updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string
    const result = await UserService.updateProfileImage(userId, req.body);

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: result,
    });
  } catch (error: any) {
    next(error);
  }
}

const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await UserService.resendVerificationEmail(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    next(error);
  }
}


export const UserController = {
  updateUserRole,
  updateProfileImage,
  resendVerificationEmail,

}