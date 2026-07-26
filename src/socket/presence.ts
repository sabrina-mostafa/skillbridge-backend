const onlineUsers = new Map<string, Set<string>>();

/**
 * userId -> socketIds
 *
 * One user may have:
 * - multiple tabs
 * - desktop + mobile
 */

export const Presence = {
    add(userId: string, socketId: string) {
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }

        onlineUsers.get(userId)!.add(socketId);
    },

    remove(userId: string, socketId: string) {
        const sockets = onlineUsers.get(userId);

        if (!sockets) return;

        sockets.delete(socketId);

        if (sockets.size === 0) {
            onlineUsers.delete(userId);
        }
    },

    isOnline(userId: string) {
        return onlineUsers.has(userId);
    },

    getOnlineUsers() {
        return [...onlineUsers.keys()];
    },

    count() {
        return onlineUsers.size;
    },
};