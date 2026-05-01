import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const notFound = (req: Request, res: Response, next: NextFunction) => {

    next(new AppError(404, `Route ${req.originalUrl} not found`));

};