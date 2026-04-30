export type CreateReviewPayload = {
    bookingId: string;
    rating: number;
    comment?: string;
}

export type UpdateReviewPayload = {
    rating?: number;
    comment?: string;
}

export type GetReviewQuery = {
  minRating?: string;
  page?: string;
  limit?: string;
  skip?: string;
  sortBy?: string;
  sortOrder?: string;
}