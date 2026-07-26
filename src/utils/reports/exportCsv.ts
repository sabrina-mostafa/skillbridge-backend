import { Parser } from "json2csv";

export const generateCSV = (
    data: Record<string, unknown>[]
) => {
    const parser = new Parser();

    return parser.parse(data);
};