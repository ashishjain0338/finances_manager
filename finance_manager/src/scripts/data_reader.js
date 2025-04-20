import * as XLSX from 'xlsx';

function processExcel(wb){
    // Convert to JSON.
    const json = XLSX.utils.sheet_to_json(ws);
}

function readLocalExcel(filepath){
    fetch(filepath)
      // Convert to ArrayBuffer.
      .then((res) => res.arrayBuffer())
      .then((data) => {
        const wb = XLSX.read(data, { type: "array" });
        const wsname = wb.SheetNames[0];
        console.log("Here2 :", wsname)
        const ws = wb.Sheets[wsname];

        
      })

}

export function readDataFromExcel(filepath){
    console.log("data-reader Called")
    readLocalExcel(filepath)
}

