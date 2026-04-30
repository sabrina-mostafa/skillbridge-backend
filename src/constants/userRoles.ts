export const USER_ROLES = {
    ADMIN: "ADMIN",
    TUTOR: "TUTOR",
    STUDENT: "STUDENT"
} as const;


export type UserRoles = typeof USER_ROLES[keyof typeof USER_ROLES]; 