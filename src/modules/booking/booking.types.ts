export type GetAllBookingsQuery = {
  searchTerm?: string;   // tutor/student name
  status?: string;
  tutorId?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}

export type GetMyBookingsQuery = {
  status?: string;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}
