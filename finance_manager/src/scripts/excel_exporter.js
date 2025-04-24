import * as XLSX from 'xlsx';

// Function to sanitize the row data and set default values
export function sanitizeData(data, headers, defaultValue = 'N/A') {
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        for (var j = 0; j < headers.length; j++) {
            var col = headers[j];
            // if(col == "maturity_date"){
            //     console.log(row[col], row[col] == "Invalid Date")
            // }
            if (row[col] == null || row[col] == undefined || row[col] == "Invalid Date") {
                row[col] = defaultValue
            }
        }
    }
    return data;
}

export function addSerialNumbers(data, key = "SNo") {
    return data.map((row, index) => ({
      [key]: index + 1,
      ...row
    }));
  }


export function exportToExcelMultiSheet(sheetsData, sheetNames = [], fileName = "exported-data.xlsx") {
    const wb = XLSX.utils.book_new();

    sheetsData.forEach((data, index) => {
        const ws = XLSX.utils.json_to_sheet(data);
        console.log(ws)
        const sheetName = sheetNames[index] || `Sheet${index + 1}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, fileName);
}
