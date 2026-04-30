const convert12hTo24hFormat = (time: string): string => {
    const match = time.trim().match(
        /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i
    );

    if (!match || !match[1] || !match[2] || !match[3]) {
        throw new Error("Invalid 12-hour format");
    }

    let hours = match[1];
    let minutes = match[2];
    let period = match[3];

    let h = parseInt(hours, 10);

    if (period.toUpperCase() === "AM") {
        if (h === 12) h = 0;
    } else {
        if (h !== 12) h += 12;
    }

    return `${String(h).padStart(2, "0")}:${minutes}`;
};

export const normalizeTime = (time: string): string => {
    const trimmed = time.trim();

    // If it contains AM/PM → convert
    if (/AM|PM/i.test(trimmed)) {
        return convert12hTo24hFormat(trimmed);
    }

    return trimmed; // assume already 24h
};