import { useState, useEffect, useMemo } from "react"
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import { Row, Col } from "react-bootstrap";
import { formatColDataForAGGrid, convertToIndiaCommaNotationFxn } from "../../scripts/utils";
import "../common_styles/ag-grid.css"

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function SPOFSummary(props) {
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [totalRow, setTotalRow] = useState([])
    const [cached, setCached] = useState({})

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
        console.log(localCache)
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
        console.log(cachedData, cacheKey)
        if (cachedData == undefined) {
            return;
        }
        setRowData(cachedData["rows"])
        setColDefs(cachedData["headers"])
        setTotalRow(cachedData["total"])
    }

    return (
        <div>
            <Row>
                <Col md={9}>
                    <div className="ag-theme-alpine" style={{ height: 400 }}>
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
                    <p>Hello World</p>
                </Col>
            </Row>

        </div>
    )

}

export { SPOFSummary }