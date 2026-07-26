

export type CreateConversationPayload = {
    participantId: string;
};

export type GetConversationQuery = {
    page?: string;
    limit?: string;
    searchTerm?: string;
    sortOrder?: "asc" | "desc";
};


export type Contact = {
    id: string;
    name: string;
    email: string;
    image: string | null;
    conversationId: string | null;
};