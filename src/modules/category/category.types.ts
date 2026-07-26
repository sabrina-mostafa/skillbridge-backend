
export type getCategoryParams = {
    search?: string;
    parentOnly?: string;
    childOnly?: string;
    hasTutors?: string;
    hasStudents?: string;
    withNoStudent?: string;
    withNoTutor?: string;
    page?: string;
    limit?: string;
    skip?: string;
    sortBy?: string;
    sortOrder?: string;
}

export type createCategoryPayload = {
    name: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    learningOutcomes?: string[];
    parentId?: string | null;
    isFeatured?: boolean;
};

export type updateCategoryPayload = {
    name?: string;
    shortDesc?: string;
    description?: string;
    thumbnail?: string;
    learningOutcomes?: string[];
    parentId?: string | null;
    isFeatured?: boolean;
};
