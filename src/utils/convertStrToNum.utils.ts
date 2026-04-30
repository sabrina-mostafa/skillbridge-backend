export const convertStrToNum = (value?: string, fieldName?: string) => {
    if (value === undefined) return undefined;

    const num = Number(value);
    if (isNaN(num)) {
        throw new Error(`Invalid ${fieldName}`);
    }

    return num;
};