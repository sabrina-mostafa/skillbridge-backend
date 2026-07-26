import ExcelJS from "exceljs";

export const generateExcel = async (
    sheetName: string,
    data: Record<string, unknown>[]
) => {
    const workbook = new ExcelJS.Workbook();

    const worksheet =
        workbook.addWorksheet(sheetName);

    if (data.length > 0) {
        worksheet.columns = Object.keys(data[0]!).map(
            (key) => ({
                header: key,
                key,
                width: 25,
            })
        );

        worksheet.addRows(data);
    }

    return workbook.xlsx.writeBuffer();
};