import { DayOfWeek } from "../../../generated/prisma/enums";

export type CreateTutorPayload = {
  bio?: string;
  experience: string;
  hourlyRate: number;
  isFeatured?: boolean;
  categories?: string[];
  availability?: string[];
};

export type GetTutorsQuery = {
  searchTerm?: string;   // subject/category name
  minPrice?: string;
  maxPrice?: string;
  minRating?: string;
  isFeatured?: string;
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}

export const dayMap: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};