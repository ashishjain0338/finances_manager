import { DOUGHNUT_COLORS } from "./constant";

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