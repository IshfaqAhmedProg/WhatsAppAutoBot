import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { getObjectWithMostKeys } from './getObjectWithMostKeys';
export function downloadFile(aooData, filename) {
  const headers = getObjectWithMostKeys(aooData);
  const aoaData = [[]];
  aooData.map((obj) => {
    aoaData.push(Object.values(obj));
  });
  console.log("aoaData", aoaData);
  downloadFormatted(headers, aoaData, filename);
}
async function downloadFormatted(headerArray, data, filename) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  console.log("headerArray", headerArray)
  // Add headers
  worksheet.addRow(headerArray);
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell(function (cell, colNumber) {
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: "12px" };
    cell.border = {}
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "7B68EE" },
    };
  })

  // Add data
  for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
    const row = data[rowIndex];

    const dataRow = worksheet.addRow(row);
    if (rowIndex > 0) {
      const imageCell = dataRow.getCell(
        headerArray.indexOf("contactProfilePicUrl") + 1
      );
      const imageUrl = imageCell.value;
      console.log("imageUrl", imageUrl)
      if (imageUrl && typeof imageUrl === "string" && imageUrl.startsWith("http")) {
        await fetch(imageUrl)
          .then(response => response.arrayBuffer())
          .then((result) => {
            const base64Image = 'data:image/jpg;base64,' + btoa(
              new Uint8Array(result)
                .reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
            console.log("base64Image", base64Image)
            console.log("imagecell", imageCell.address, imageCell.value)
            const imageId = workbook.addImage({
              base64: base64Image,
              extension: "jpg",
            });
            worksheet.addImage(imageId, {
              tl: { col: headerArray.indexOf("contactProfilePicUrl"), row: rowIndex + 1 },
              ext: { width: 80, height: 80 }
            })
            worksheet.getRow(imageCell.row).height = 60; // Adjust the row height to fit the image
            worksheet.getColumn(imageCell.col).width = 11.25; // Adjust the row height to fit the image
            imageCell.alignment = { vertical: 'middle', horizontal: 'center' };
          })
      }
    }

  }

  workbook.xlsx.writeBuffer().then(function (data) {
    var blob = new Blob([data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, filename);
  });
}

