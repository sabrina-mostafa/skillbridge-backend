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
    searchTerm?: string;
    minRating?: string;
    page?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    sortOrder?: string;
}