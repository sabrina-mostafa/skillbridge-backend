
export type CreateStudentPayload = {
    bio?: string;
    education?: string;
    categories?: string[];
};

export type GetStudentQuery = {
  searchTerm?: string;   // username/email/category name
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}
