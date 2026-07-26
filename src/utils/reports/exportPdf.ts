import PDFDocument from "pdfkit";
import { Response } from "express";

export const generatePDF = (
    title: string,
    report: any,
    res: Response
) => {
    const doc = new PDFDocument({
        margin: 40,
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${title}.pdf`
    );

    doc.pipe(res);

    doc.fontSize(20).text(title);

    doc.moveDown();

    doc.fontSize(12).text(
        `Generated At: ${report.generatedAt}`
    );

    doc.moveDown();

    doc.fontSize(10).text(
        JSON.stringify(report.data, null, 2)
    );

    doc.end();
};