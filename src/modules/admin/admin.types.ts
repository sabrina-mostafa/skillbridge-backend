import { Status } from "../../../generated/prisma/enums";
import { UserRoles } from "../../constants/userRoles";

export type GetAllUsersQuery = {
  searchTerm?: string;   // name/email
  role?: UserRoles;
  status?: Status;
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}