import { getIO } from "./socket";


export const emitToUser = (
    userId: string,
    event: string,
    payload: unknown
) => {
    getIO().to(userId).emit(event, payload);
};