const express = require("express");
const fs = require("fs");
const { jsPDF } = require("jspdf");
const {
    getWrappedTextLines,
    totalMoney,
    totalCount
  } = require('../UtilityFunctions/invoiceUtilityFunctions');

const router = express.Router();

// Create a directory if it doesn't exist
const pdfDirectory = "./pdfs/";
if (!fs.existsSync(pdfDirectory)) {
  fs.mkdirSync(pdfDirectory);
}

router.get("/generate-pdf", (req, res) => {

    const {item, gst, add} = req.body;

    // console.log(req.body)

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: [5.8, 8.3], // A5 size in inches (portrait)
  });

//   doc.addImage(img ? img : Logo, "PNG", 0.5, 0.7, 0.7, 0.7);

  doc.setFontSize(17);
  doc.setFont("helvetica", "bold"); // Set font as bold
  const textes = `${add.shopName}`;
  const textWidths = 170; // Maximum width for the text
  const textLinese = getWrappedTextLines(textes, textWidths);
  doc.text(textLinese, 0.5, 1.7); // Example content

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("Office Address", 0.5, 2.2);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const text = `${add.address}`;
  const textWidth = 100; // Maximum width for the text

  const textLines = getWrappedTextLines(text, textWidth);
  doc.text(textLines, 0.5, 2.4);

  doc.text(`${add.contact}`, 0.5, 3);

  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice", 3.8, 1);

  doc.setFontSize(12);
  doc.text(`${item.today}`, 3.8, 1.2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`GSTIN - ${gst ? gst : ""}`, 3.8, 1.5);

  doc.setFontSize(10);
  doc.text("to:", 3.8, 2.2);

  doc.text(`${item.clientName}`, 3.8, 2.4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  const texts = `${item.clientAddress}`;

  const textLiness = getWrappedTextLines(texts, textWidth);
  doc.text(textLiness, 3.8, 2.6);

  doc.text(`${item.clientContact}`, 3.8, 3);

  // Table headers
  const headers = ["Item", "Price", "Qnt", "Disc", "GST", "Total"];
  const headerPositions = [0.6, 2.5, 3.2, 3.6, 4, 4.6];

  let startY = 3.5; // Initial Y position for the first row
  const lineHeight = 0.3; // Height of each row

  doc.setFillColor(0); // Transparent fill color
  doc.rect(0.5, startY - 0.17, 4.8, 0.24, "F");
  doc.setTextColor("#fff"); // Example: white color
  // Populate table headers
  headers.forEach((header, index) => {
    doc.text(header, headerPositions[index], startY);
  });
  doc.setTextColor("#000"); // Example: Black color

  // Populate table with data
  item.saleItem.forEach((item, index) => {
    const { name, salePrice, quantity, disc, gst, amount } = item;

    const yPos = startY + (index + 1) * lineHeight;

    doc.text(String(name), headerPositions[0], yPos);
    doc.text(String(salePrice), headerPositions[1], yPos);
    doc.text(String(quantity), headerPositions[2], yPos);
    doc.text(String(disc ? disc + "%" : "0%"), headerPositions[3], yPos);
    doc.text(String(gst ? gst + "%" : "0%"), headerPositions[4], yPos);
    doc.text(String(amount), headerPositions[5], yPos);
  });

  const tableBottomY = startY + (item.saleItem.length + 1) * lineHeight; // Calculate the bottom of the table

  // Example: Continue with other content below the table
  const nextSectionY = tableBottomY + 0.5; // Example: Start the next section below the table

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Total Qyt.", 1.7, nextSectionY);

  const sumCount = totalCount(item.saleItem);
//   const sumCount = 3425324;
  doc.text(`${sumCount}`, 2.5, nextSectionY);

  doc.setFont("helvetica", "bold");
  doc.text("Sub-total", 3.2, nextSectionY);

  doc.setFont("helvetica", "bold");
  const sumMoney = totalMoney(item.saleItem)
  doc.text(`${sumMoney}`, 4.4, nextSectionY);

  // Set background color behind the text
  const t = "Grand-total";
  const xPos = 3.2;
  const fontSize = 12;
  const backgroundColor = "#000"; // Example: Yellow color

  // Get text width and height
  const tex = doc.getTextWidth(text);

  // Draw a rectangle as background
  doc.setFillColor(backgroundColor);
  doc.rect(xPos - 0.07, nextSectionY + 0.06, tex + 1, 0.36, "F"); // Adjust rectangle size as needed

  // Set font size and color for the text
  doc.setFontSize(fontSize);
  doc.setTextColor("#fff"); // Example: Black color

  // Add the text on top of the rectangle
  doc.text(t, xPos, nextSectionY + 0.3);
  doc.text(`${sumMoney}`, 4.4, nextSectionY + 0.3);

  doc.setTextColor("#000");

  doc.setFont("", "bold");
  doc.text("Thank you for business with us!", 0.5, nextSectionY + 0.7);

  // Generate the PDF file
  const fileName = `${item.clientName}.pdf`;
  const filePath = `./pdfs/${fileName}`; // Replace with your desired storage path

  // Save the PDF on the server
  doc.save(filePath, (error) => {
    if (error) {
      console.error("Error saving PDF:", error);
      res.status(500).send("Internal Server Error");
    } else {
      // Set content type as application/pdf
      res.setHeader("Content-Type", "application/pdf");

      // Send the generated PDF file as a response
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      // Remove the generated file after sending the response
      fileStream.on("close", () => {
        fs.unlinkSync(filePath);
      });
    }
  });
});

module.exports = router;
