import { MyDoughnut } from "../summary/doughnut"
import { useState, useEffect } from "react"
import { DUMMY_DOUGHTNUT_DATA } from "../../scripts/constant"
import { convertSqlResultToDoughNutInput } from "../../scripts/utils"
import alasql from "alasql"
function CustomMaturityDoughnut(props){
    const [plotData, setPlotData] = useState([[],[],0])

    useEffect(() => {
        // Need to connvert gridData to plot data
        if(props.gridData.length == 0){
            setPlotData([[], [], 0])// Empty Plot
            return;
        }
        var query = `
            SELECT SUM(amount) as amount, fund_type from ?
            GROUP BY fund_type
        `
        const result = alasql(query, [props.gridData])
        setPlotData(convertSqlResultToDoughNutInput(result, "fund_type", "amount"))

    }, [props.gridData])


    return (
        <div>
            <MyDoughnut plotData={plotData}/>
        </div>
    )
}

export {CustomMaturityDoughnut}