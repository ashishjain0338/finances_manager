import * as XLSX from 'xlsx';
import { MANDATORY_COLS, ALLOWED_NAMES,FILLER_WORDS } from './constant';

function mapMandatoryColumnToHeader(headers, exclude_columns = []){
    /*
        Mandatory Columns include:
        1. Fund_type
        2. Bank_Name (Entity that Allocated the fund)
        3. Name (Holders-Name)
        4. Nominee
        5. Fund_Number
        6. Amount
        7. Is_Closed
        8. Maturity_date
        9. 
        10. 

    */
//    console.log("HEt : ", exclude_columns)
   var mapping = MANDATORY_COLS.map((val, index) => {
        var colname = val["name"]
        if (exclude_columns.includes(colname)){
            return [colname, -1]
        }
        var patternToMatch = val["pattern"]
        var mappedIndex = -1
        for (var  i =0; i < patternToMatch.length; i++){
            var pattern = patternToMatch[i];
            // Header is a 1D list, we go to each header and check include clause
            mappedIndex = headers.findIndex(item => item.toLowerCase().includes(pattern));
            // console.log(mappedIndex, pattern, headers);
            if (mappedIndex != -1)
                break;
            
        }
        if (mappedIndex == -1){
            console.error("Unable to mapMandatoryColumnToHeader for Col ", colname, ": Please Check Excel Header")
        }

        return [colname, mappedIndex]

   })
   return mapping

}

function resolveNameToPrimaryAndSecondary(name){
    const nameList = name.split(' ').filter((word) => {return (!FILLER_WORDS.includes(word.toLowerCase()) && word.trim() !== '')});
    var out = []
    for(var i = 0; i < nameList.length; i++){
        var singleName = nameList[i].toLowerCase()
        if(!ALLOWED_NAMES.includes(singleName)){
            console.error("Name " + singleName + " is not Allowed given from name = ", name)
            
        }else{
            out.push(singleName)
        }
    }
    return out;
}

function validateSingleCell(row, old_col_name, new_col_name, identity_for_alert = ""){
    var col_val = row[old_col_name]
    delete row[old_col_name]

    switch (new_col_name){
        case "fund_type":
        case "bank_name":
        case "fund_number":
        case "amount":
            // Non-Null Clause
            if (col_val == undefined){
                console.error(row)
                console.error(new_col_name + " Can't be undefined for " + identity_for_alert + "| Check Input-data");
            }
            row[new_col_name] = col_val
            break;
        case "name":
            var names = resolveNameToPrimaryAndSecondary(col_val)
            row["primary_holder"] = names[0]
            row["secondary_holder"] = names[1]
            break;
        case "nomination":
            // Either it could be undefined or it must be present in allowed-names
            if(col_val != undefined){
                var nominee = col_val
                const nomineeList = nominee.split(' ').filter((word) => {return (!FILLER_WORDS.includes(word.toLowerCase()) && word.trim() !== '')});
                var your_nominee = nomineeList[0].toLowerCase()
                if(ALLOWED_NAMES.includes(your_nominee)){
                    row[new_col_name] = your_nominee
                }else{
                    console.error("Nomination name " + your_nominee + " is not allowed")
                }
            }
            break;
        case "is_closed":
            // If the value is Nan/ undefined 
            if (col_val == undefined){
                row[new_col_name] = false
            }else {
                row[new_col_name] = true
            }
            break;
        default:
            row[new_col_name] = col_val
    }
    return row
}

function processExcelSheet(ws, sheet_name, exclude_columns = [], default_columns = [], drop_columns = []){
    var forHeader =  XLSX.utils.sheet_to_json(ws, { header: 1 });
    const headers = forHeader[0]
    forHeader = null // Clear Memory
    console.log("Sheet name --> ", sheet_name, "Headers --> ",headers)
    const json = XLSX.utils.sheet_to_json(ws);
    var colMapping = mapMandatoryColumnToHeader(headers, exclude_columns);
    const cleanedData = []
    for(var i = 0; i < json.length; i++){
        var row = json[i];
        for(var j = 0; j < colMapping.length; j++){
            if(colMapping[j][1] != -1){
                // Mapping Exist
                var new_col_name = colMapping[j][0], old_col_name = headers[colMapping[j][1]]
                row = validateSingleCell(row, old_col_name, new_col_name, "Row-number " + i)
            }
        }

        for(var j = 0; j < default_columns.length; j++){
            var defaultColData = default_columns[j];
            row[defaultColData[0]] = defaultColData[1]
        }

        for(var j = 0; j < drop_columns.length; j++){
            delete row[drop_columns[j]]
        }

        cleanedData.push(row)
    }
    return cleanedData;
}

function processExcelWorkBook(wb){
    var out = []
    for(var i = 0; i < wb.SheetNames.length; i++){
        var sheetName = wb.SheetNames[i];
        var cleanedData = []
        switch (sheetName){
            case "Accounts":
                var ws = wb.Sheets[sheetName];
                var exclude_columns = ["maturity_date"] // Accounts do not have maturity-date
                cleanedData = processExcelSheet(ws, sheetName, exclude_columns)
                break;
            case "FD's":
                var ws = wb.Sheets[sheetName];
                var exclude_columns = ["fund_type"] // Fund_type is FD
                var default_columns = [["fund_type", "FD"]]
                var drop_columns = ["S No"]
                cleanedData = processExcelSheet(ws, sheetName, exclude_columns, default_columns, drop_columns)
                break;
            case "NSC":
                var ws = wb.Sheets[sheetName];
                var exclude_columns = ["fund_type", "bank_name"] // Fund_type is NSC
                var default_columns = [["fund_type", "NSC"], ["bank_name", "Post-Office"]]
                var drop_columns = ["S No"]
                cleanedData = processExcelSheet(ws, sheetName, exclude_columns, default_columns, drop_columns)
                break;
            case "PPF":
                var ws = wb.Sheets[sheetName];
                var exclude_columns = [ "bank_name", "maturity_date"] // No Concept of Maturity
                var default_columns = [["bank_name", "Post-Office"]]
                var drop_columns = []
                cleanedData = processExcelSheet(ws, sheetName, exclude_columns, default_columns, drop_columns)
                break;
            case "LIC":
                var ws = wb.Sheets[sheetName];
                var exclude_columns = ["fund_type", "bank_name"]  // Fund_type is FD
                var default_columns = [["fund_type", "LIC"],["bank_name", "LIC"]]
                var drop_columns = []
                cleanedData = processExcelSheet(ws, sheetName, exclude_columns, default_columns, drop_columns)
                break;
            default:
                console.warn("Sheet " + sheetName + "  is not handled| Ignoring")
        }
        out = out.concat(cleanedData)
    }
    return out
}


export async function readLocalExcel(filepath) {
    const res = await fetch(filepath);
    const data = await res.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" , cellDates: true});
    return processExcelWorkBook(wb);
}

// function readLocalExcel(filepath){
//     var out
//     fetch(filepath)
//       // Convert to ArrayBuffer.
//       .then((res) => res.arrayBuffer())
//       .then((data) => {
//         const wb = XLSX.read(data, { type: "array" });
//         out = processExcelWorkBook(wb)
//       })
//     return out

// }