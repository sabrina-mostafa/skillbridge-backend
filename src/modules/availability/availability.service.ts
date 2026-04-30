import { DayOfWeek } from "../../../generated/prisma/enums";
import { USER_ROLES } from "../../constants/userRoles";
import { AppError } from "../../errors/AppError";
import paginationSorting from "../../helpers/paginationSorting.helper";
import { prisma } from "../../lib/prisma";
import { normalizeTime } from "../../utils/normalizeTime.utils";
import { timeToMinutes } from "../../utils/timeToMinutes";
import { GetAllAvailabilitiesQuery } from "./availability.types";


const isValidTime = (time: string) => {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time); // HH:mm
};

const isValidSlot = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    return m === 0 || m === 30;
};


const getMyAvailability = async (userId: string) => {

    if (!userId) {
        throw new AppError(401, "Unauthorized");
    }

    const tutor = await prisma.tutorProfile.findUnique({
        where: { userId },
        select: { id: true },
    })

    if (!tutor) {
        throw new AppError(404, "Tutor profile not found");
    }

    return prisma.availability.findMany({
        where: { tutorId: tutor.id },
        orderBy: [
            { dayOfWeek: "asc" },
            { startTime: "asc" },
        ],
    });
};

const getAllAvailabilities = async (query: GetAllAvailabilitiesQuery) => {

    const { tutorId, dayOfWeek } = query;

    // 1. Pagination
    const { page, limit, skip, sortBy, sortOrder } = paginationSorting(query);

    const allowedSortFields = ["createdAt", "startTime"];
    const safeSortBy = sortBy && allowedSortFields.includes(sortBy)
        ? sortBy
        : null;

    const where: any = {};

    // 2. Tutor filter (optimized: no extra DB query unless needed)
    if (tutorId) {
        const tutorExists = await prisma.tutorProfile.findUnique({
            where: { id: tutorId },
            select: { id: true },
        });

        if (!tutorExists) {
            throw new AppError(404, "Tutor not found");
        }

        where.tutorId = tutorId;
    }

    // 3. Day filter with safe enum validation
    if (dayOfWeek !== undefined) {
        const isValidDay = Object.values(DayOfWeek).includes(
            dayOfWeek as DayOfWeek
        );

        if (!isValidDay) {
            throw new AppError(400, "Invalid dayOfWeek value");
        }

        where.dayOfWeek = dayOfWeek;
    }

    // 4. Run queries in parallel
    const [availabilities, total] = await Promise.all([
        prisma.availability.findMany({
            where,
            take: limit,
            skip,
            orderBy: safeSortBy
                ? { [safeSortBy]: sortOrder || "asc" }
                : [
                    { dayOfWeek: "asc" },
                    { startTime: "asc" },
                ],
        }),

        prisma.availability.count({
            where,
        }),
    ]);

    // 5. Response
    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data: availabilities,
    };
};

const createAvailability = async (
    payload: {
        dayOfWeek: DayOfWeek;
        startTime: string;
        endTime: string;
        slotDuration?: number;
    },
    userId: string
) => {
    const { dayOfWeek, startTime: sTime, endTime: eTime, slotDuration } = payload;

    if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
        throw new AppError(400, "Invalid dayOfWeek value");
    }

    if (!isValidSlot(sTime) || !isValidSlot(eTime)) {
        throw new AppError(400, "Time must be in 30-minute intervals");
    }

    const duration = slotDuration ?? 30;
    const SLOT_BASE = 30;
    if (duration <= 0 || duration % SLOT_BASE !== 0) {
        throw new AppError(400, "slotDuration must be a positive multiple of 30 minutes");
    }

    const startTime = normalizeTime(sTime);
    const endTime = normalizeTime(eTime);

    // Validation
    if (!isValidTime(startTime) || !isValidTime(endTime)) {
        throw new AppError(400, "Invalid time format");
    }

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    const diffMinutes = endMinutes - startMinutes;

    if (diffMinutes <= 0) {
        throw new AppError(400, "Start time must be before end time");
    }

    if (diffMinutes % duration !== 0) {
        throw new AppError(400,
            "Availability duration must be divisible by slotDuration"
        );
    }

    const tutor = await prisma.tutorProfile.findUnique({
        where: { userId },
        select: {
            id: true
        }
    });
    if (!tutor) {
        throw new AppError(404, "Tutor not found!");
    }

    // Check overlapping availability
    const existing = await prisma.availability.findFirst({
        where: {
            tutorId: tutor.id,
            dayOfWeek,
            AND: [
                {
                    startTime: { lt: endTime },
                },
                {
                    endTime: { gt: startTime },
                },
            ],
        },
    });

    if (existing) {
        throw new AppError(409, "Overlapping availability exists");
    }

    return prisma.availability.create({
        data: {
            tutorId: tutor.id,
            dayOfWeek,
            startTime,
            endTime,
            slotDuration: duration, // or from payload later
        },
    });
};

const updateAvailability = async (
    userId: string,
    availabilityId: string,
    payload: Partial<{
        dayOfWeek: DayOfWeek;
        startTime: string;
        endTime: string;
        slotDuration: number;
    }>
) => {

    const existing = await prisma.availability.findUnique({
        where: { id: availabilityId },
    });

    if (!existing) {
        throw new AppError(404, "Availability not found");
    }

    // Authorization
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (user?.role !== USER_ROLES.TUTOR && user?.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized!");
    }

    if (user?.role === USER_ROLES.TUTOR) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId },
        });

        if (tutor?.id !== existing.tutorId) {
            throw new AppError(403, "Unauthorized! Only the owner can edit!");
        }
    }

    // Resolve final values (payload OR existing)
    const dayOfWeek = payload.dayOfWeek ?? existing.dayOfWeek;

    if (!Object.values(DayOfWeek).includes(dayOfWeek)) {
        throw new AppError(400, "Invalid dayOfWeek value");
    }

    const duration = payload.slotDuration ?? existing.slotDuration;
    const SLOT_BASE = 30;

    if (duration <= 0 || duration % SLOT_BASE !== 0) {
        throw new AppError(400, "slotDuration must be a positive multiple of 30 minutes");
    }

    // Normalize time strings first
    const startTime = payload.startTime
        ? normalizeTime(payload.startTime)
        : existing.startTime;

    const endTime = payload.endTime
        ? normalizeTime(payload.endTime)
        : existing.endTime;

    if (!isValidTime(startTime) || !isValidTime(endTime)) {
        throw new AppError(400, "Invalid time format. Use HH:mm");
    }
    if (!isValidSlot(startTime) || !isValidSlot(endTime)) {
        throw new AppError(400, "Time must be in 30-minute intervals");
    }

    // Convert to minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    const diffMinutes = endMinutes - startMinutes;

    if (diffMinutes <= 0) {
        throw new AppError(400, "Start time must be before end time");
    }

    if (diffMinutes % duration !== 0) {
        throw new AppError(400, "Availability duration must be divisible by slotDuration");
    }

    // Overlap check (fixed: now using DateTime)
    const overlap = await prisma.availability.findFirst({
        where: {
            tutorId: existing.tutorId,
            dayOfWeek,
            id: { not: availabilityId },
            AND: [
                {
                    startTime: { lt: endTime },
                },
                {
                    endTime: { gt: startTime },
                },
            ],
        },
    });
    if (overlap) {
        throw new AppError(409, "Overlapping availability exists");
    }

    // Update
    return prisma.availability.update({
        where: { id: availabilityId },
        data: {
            dayOfWeek,
            startTime,
            endTime,
            slotDuration: duration,
        },
    });
};

const deleteAvailability = async (availabilityId: string, userId: string) => {
    const existing = await prisma.availability.findUnique({
        where: { id: availabilityId },
    });

    if (!existing) {
        throw new AppError(404, "Availability not found");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (user?.role !== USER_ROLES.TUTOR && user?.role !== USER_ROLES.ADMIN) {
        throw new AppError(403, "Unauthorized!");
    }

    if (user?.role === USER_ROLES.TUTOR) {
        const tutor = await prisma.tutorProfile.findUnique({
            where: { userId },
        });

        if (tutor?.id !== existing.tutorId) {
            throw new AppError(403, "Unauthorized! Only the owner can delete!");
        }
    }

    return prisma.availability.delete({
        where: { id: availabilityId },
    });
};

export const AvailabilityService = {
    getMyAvailability,
    getAllAvailabilities,
    createAvailability,
    updateAvailability,
    deleteAvailability,
};