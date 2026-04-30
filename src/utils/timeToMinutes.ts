export const timeToMinutes = (time: string) => {
    const parts = time.split(":");

    if (parts.length !== 2) {
        throw new Error("Invalid time format. Expected HH:mm");
    }

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);

    if (
        Number.isNaN(hours) ||
        Number.isNaN(minutes)
    ) {
        throw new Error("Invalid time value");
    }

    return hours * 60 + minutes;
};