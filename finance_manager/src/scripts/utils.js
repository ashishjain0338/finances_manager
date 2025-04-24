import { DOUGHNUT_COLORS, HONORED_NAMES } from "./constant";

export function convertSqlResultToDoughNutInput(result, label_key, val_key, capitalize = true){
    var labels = [], data = [];
    var total = 0
    for(var i = 0;i < result.length; i++){
        var label = result[i][label_key]
        if (capitalize){
            label = label.charAt(0).toUpperCase() + label.slice(1);
        }

        labels.push(label)
        var curData = result[i][val_key]
        total += curData
        data.push(curData)
    }
    return [labels, data, total]

}

export function getBackgroundColor(required_size){
    var colors = []
    var j = 0
    for(var i = 0;i < required_size; i++){
        colors[i] = DOUGHNUT_COLORS[j]
        j = (j  + 1)%(DOUGHNUT_COLORS.length)
    }
    return colors
}

export function roundTo(value, decimals) {
    return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  }

export function getCurrentDate(){
    const today = new Date();
    var todayFormatted = today.toISOString().split('T')[0];
    return todayFormatted
}

export function getFinancialYear(year){
    return [`${year}-04-01`, `${year + 1}-03-31`]
}

export function deduceCurrentFinancialYear(){
    const today = new Date();
    // getMonth returns months 0-indexed, therefore +1
    if (today.getMonth() + 1 >= 4){
        //After April, Current year is the financial Year
        return today.getFullYear()
    }else{
        return today.getFullYear() - 1
    }
}

export function formatColDataForAGGrid(headers, order=[]){
    // First put the thing in order
    var out = order.map((val) => {return {field: val}})
    // Now add left-out columns
    for(var i =0 ;i < headers.length; i++){
        if(!order.includes(headers[i])){
            out.push({field : headers[i]})
        }
    }
    return out
}


export function convertToIndiaCommaNotationFxn(val){
    if (val == null) return 0;
    return new Intl.NumberFormat('en-IN').format(val);
}

export function checkSpofCondition(name){
    // Returns true if It satisfy the SPOF condition
    if(name === undefined || HONORED_NAMES.includes(name))
        return true;
    return false;
}

export function getValFromJSObject(obj, key, valueIfKeyNotFound = 0) {
    // Check if the key exists in the object
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
        return obj[key];
    } else {
        return valueIfKeyNotFound;
    }
}

export function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  