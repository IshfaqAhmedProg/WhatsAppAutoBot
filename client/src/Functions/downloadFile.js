import { utils, writeFile } from "sheetjs-style-v2";

export function downloadFile(aooData, filename) {
    const headers = Object.keys(aooData[0]);
    const aoaData = [[]];
    aooData.map((obj) => {
        aoaData.push(Object.values(obj));
    });
    console.log("aoaData", aoaData);
    downloadFormatted(headers, aoaData, filename);
}
function downloadFormatted(headerArray, data, filename) {
    headerArray.forEach((header) => {
        data[0].push({
            v: `${header}`,
            t: "s",
            s: {
                font: { bold: true, color: { rgb: "FFFFFFFF" } },
                fill: { fgColor: { rgb: "FF7B68EE" } },
                border: {
                    top: { style: "medium", color: { rgb: "FF7B68EE" } },
                    bottom: { style: "medium", color: { rgb: "FF7B68EE" } },
                    left: { style: "medium", color: { rgb: "FF7B68EE" } },
                    right: { style: "medium", color: { rgb: "FF7B68EE" } },
                },
                alignment: { wrapText: true },
            },
        });
    });
    console.table("data", data);
    const worksheet = utils.aoa_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet);
    writeFile(
        workbook,
        `${filename}`
    );
}