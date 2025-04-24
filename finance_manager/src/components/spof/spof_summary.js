import { useState, useEffect, useMemo } from "react"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import { Row, Col } from "react-bootstrap";
import { formatColDataForAGGrid, convertToIndiaCommaNotationFxn, convertSqlResultToDoughNutInput } from "../../scripts/utils";
import "../common_styles/ag-grid.css"
import { MyDoughnut } from "../summary/doughnut";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function SPOFSummary(props) {
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [totalRow, setTotalRow] = useState([])
    const [cached, setCached] = useState({})
    const [plotData, setPlotData] = useState([[], [], 0])

    // Apply settings across all columns
    const defaultColDef = useMemo(() => ({
        filter: true, // Enable filtering on all columns
        // flex:1,
    }))

    const gridOptions = {
        autoSizeStrategy: {
            type: 'fitCellContents'
        },

        // other grid options ...
    }

    useEffect(() => {
        var localCache = {}
        for (const groupByCol of ["bank_name", "fund_type"]) {
            for (const mode of ["count", "sum"]) {
                var [data, headers, total] = props.dbObj.getSPOFSummary(groupByCol, mode);
                var formattedHeaders = formatColDataForAGGrid(headers)
                // For Numerical-Fields
                // Aligning numbers to right
                for (var i = 0; i < formattedHeaders.length; i++) {
                    if (formattedHeaders[i]["field"] != groupByCol) {
                        formattedHeaders[i]["cellStyle"] = { textAlign: "right" }
                        formattedHeaders[i]["valueFormatter"] = (params) => { return (convertToIndiaCommaNotationFxn(params.value) ?? 0) }
                    }
                }
                total[groupByCol] = "Total"

                localCache[`${groupByCol}_${mode}`] = {
                    "headers": formattedHeaders,
                    "rows": data,
                    "total": [total]
                }
            }
        }
        setCached(localCache)
    }, [props.dbObj])

    useEffect(() => {
        var mode = (props.isSumMode ? "sum" : "count")
        var groupByCol = (props.isGroupBybank ? "bank_name" : "fund_type")
        loadFromCache(mode, groupByCol)
    }, [props.isSumMode, props.isGroupBybank, cached])

    function loadFromCache(mode, groupByCol) {
        var cacheKey = `${groupByCol}_${mode}`
        var cachedData = cached[cacheKey]
        if (cachedData == undefined) {
            return;
        }
        setRowData(cachedData["rows"])
        setColDefs(cachedData["headers"])
        setTotalRow(cachedData["total"])
        
        // Also Set Plot for Doughnut

        var tot_row = cachedData["total"][0]
        var labels = [], data = [], total = 0
        for(var i = 1; i <= 6; i++){
            var key = `dangerLevel${i}`
            labels.push(`Level-${i}`)
            data.push(tot_row[key])
            total += tot_row[key]

        }
        setPlotData([labels, data, total])
    }

    return (
        <div>
            <Row>
                <Col md={9}>
                    <div className="ag-theme-alpine" style={{ height: 500 }}>
                        <AgGridReact
                            rowData={rowData}
                            columnDefs={colDefs}
                            defaultColDef={defaultColDef}
                            gridOptions={gridOptions}
                            // pagination={true}
                            theme={themeAlpine}
                            pinnedBottomRowData={totalRow}
                            domLayout='autoHeight'
                        />
                    </div>
                </Col>
                <Col>
                    <MyDoughnut plotData={plotData}/>
                    <p style={{ textAlign: "right" }}>Total: {plotData[2]}</p>
                </Col>
            </Row>

        </div>
    )

}

export { SPOFSummary }