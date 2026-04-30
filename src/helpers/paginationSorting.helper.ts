type IOptions = {
    page?: string,
    limit?: string,
    sortBy?: string,
    sortOrder?: string
}

type IPaginationSortingResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: string
}


const paginationSorting = (options: IOptions): IPaginationSortingResult => {
    // Helper function to handle pagination and sorting logic

    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";

    return { page, limit, skip, sortBy, sortOrder };
};


export default paginationSorting;