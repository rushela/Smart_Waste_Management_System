const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

function createPdfDocument() {
  return new PDFDocument();
}

function applyDefaultPdfContent(doc, { title = 'Smart Waste Report', generatedAt = new Date() } = {}) {
  doc.fontSize(18).text(title, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Generated: ${generatedAt.toISOString()}`);
}

function buildCsvContent(rows) {
  const parser = new Parser();
  return parser.parse(rows);
}

module.exports = {
  createPdfDocument,
  applyDefaultPdfContent,
  buildCsvContent
};
