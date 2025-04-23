import { useEffect, useState, useMemo } from "react"
import { getCurrentDate, formatColDataForAGGrid, convertToIndiaCommaNotationFxn } from "../../scripts/utils";
import { DUMMMY_AGGRID_COLDEFS, DUMMMY_AGGRID_DATA } from "../../scripts/constant";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import "../common_styles/ag-grid.css"

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function MaturitySummary(props) {
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
        // Get Data for Summary
        for(const mode of ["count", "sum"]){
            var [data, total] = props.dbObj.getMaturitySummary(mode);
            if (data.length == 0)
                return;

            var headers = Object.keys(data[0])
            var formattedHeaders = formatColDataForAGGrid(headers, ["fund_type", "closed", "matured"])
            // Aligning numbers to right
            for(var i = 0;i < formattedHeaders.length; i++){
                if(formattedHeaders[i]["field"] != "fund_type")
                {
                    formattedHeaders[i]["cellStyle"] = { textAlign: "right" }
                    formattedHeaders[i]["valueFormatter"] =  (params) => {return convertToIndiaCommaNotationFxn(params.value)}
                }
                    
            }
            cached[mode] = {
                "headers": formattedHeaders,
                "rows": data,
                "total": total
            }
        }

        loadFromCache("count");
    }, [props.dbObj])

    useEffect(() => {
        if(props.isSumMode){
            loadFromCache("sum");
        }else{
            loadFromCache("count");
        }
    }, [props.isSumMode])


    function loadFromCache(mode){
        if(Object.keys(cached).length === 0 )
            return;
        var data = cached[mode];
        setColDefs(data["headers"])
        setRowData(data["rows"])
        setTotalRow(data["total"])
    }

    return (
        <div>
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
        </div>
    )

}

export { MaturitySummary }