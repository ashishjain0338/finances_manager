import { Row, Col, Form, Button } from "react-bootstrap"
import { useState, useEffect, useMemo, useRef } from "react"
import { formatColDataForAGGrid, convertToIndiaCommaNotationFxn, convertSqlResultToDoughNutInput, moveKeyToFirst } from "../../scripts/utils";
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import { MyDoughnut } from "../summary/doughnut";
import { SPOFDefination } from "./spof_definations";
import { exportToExcelMultiSheet, sanitizeData, addSerialNumbers } from "../../scripts/excel_exporter";
import { DANGER_LEVEL_DEFS_EXCEL } from "../../scripts/constant";
import "../common_styles/ag-grid.css"

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function SPOFCustom(props) {
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [totalRow, setTotalRow] = useState([]);
    const [isBankGroupBy, setIsBankGroupBy] = useState(true);
    const [level, setLevel] = useState(0);
    const [plotData, setPlotData] = useState([["A", "B"],[1,2],0])
    const gridRef = useRef();

    // Apply settings across all columns
    const defaultColDef = useMemo(() => ({
        filter: true, // Enable filtering on all columns
        // flex:1,
    }))

    // function changeGroupbyMethodFor

    function changeLevelFromDropdown(val) {
        val = parseInt(val);
        if (val >= 1 && val <= 6) {
            setDangerLevelData(val)
            getAndSetPlotData(val)
            setLevel(val)
        }
    }

    function exportSpofData(){
        var sheetData = [DANGER_LEVEL_DEFS_EXCEL]
        var sheetName = ["Definations"]
        for(var lvl = 1; lvl <= 6; lvl++){
            var [data, tot_row] = props.dbObj.getSpofDataByLevel(lvl)
            // console.log(data, tot_row)
            data.push(tot_row[0])
            for(var i = 0; i < data.length; i++){
                data[i]["Level"] = lvl
                data[i] = moveKeyToFirst(data[i], "Level")
            }
            if(data.length == 0)
                continue
            var headers = Object.keys(data[0])
            data = sanitizeData(data, headers, "")
            data = addSerialNumbers(data)
            sheetData.push(data)
            sheetName.push(`Level-${lvl}`)
        }
        exportToExcelMultiSheet(sheetData, sheetName)
        
    }


    function setDangerLevelData(level) {
        var [data, tot_row] = props.dbObj.getSpofDataByLevel(level)
        if (data.length == 0) {
            // Empty Table
            setRowData([])
            setColDefs([])
            setTotalRow([])
            return;
        }

        var headers = Object.keys(data[0])
        var formattedHeaders = formatColDataForAGGrid(headers)
        for (var i = 0; i < formattedHeaders.length; i++) {
            if (formattedHeaders[i]["field"] == "amount") {
                formattedHeaders[i]["cellStyle"] = { textAlign: "right" }
                formattedHeaders[i]["valueFormatter"] = (params) => { return convertToIndiaCommaNotationFxn(params.value) }
            }
        }
        setRowData(data)
        setColDefs(formattedHeaders)
        setTotalRow(tot_row)

    }

    function getAndSetPlotData(level){
        var groupByCol
        console.log("Check level :", level, " GroupbyCol(isBank) : ", isBankGroupBy)
        if(isBankGroupBy){
            groupByCol = "bank_name";
        }else{
            groupByCol = "fund_type"
        }
        var data = props.dbObj.getSpofDataByLevelForDoughnut(level, groupByCol)
        if (data == []){
            // Do Nothing
        }
        var cleaned = convertSqlResultToDoughNutInput(data, groupByCol, "amount");
        setPlotData(cleaned)

    }

    useEffect(() => {
        getAndSetPlotData(level)
    }, [isBankGroupBy])

    useEffect(() => {
        // setDangerLevelData(1)
    }, [props.dbObj])


    return (
        <div>
            <Row>
                <Col md={9}>
                    <Row>
                        <Col md={3} >
                            <Form.Group controlId="rangeSelect">
                                <Form.Select onChange={(e) => changeLevelFromDropdown(e.target.value)}>
                                    <option value="">Level</option>
                                    <option value="1">Level-I</option>
                                    <option value="2">Level-II</option>
                                    <option value="3">Level-III</option>
                                    <option value="4">Level-IV</option>
                                    <option value="5">Level-V</option>
                                    <option value="6">Level-VI</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col>
                        <Button style={{float: "right"}} onClick={() => {exportSpofData()}}>Export</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <hr />
                        <SPOFDefination level={level} />
                        
                            <hr />
                            <div className="ag-theme-alpine" style={{ height: 400 }}>
                                <AgGridReact
                                    ref={gridRef}
                                    rowData={rowData}
                                    columnDefs={colDefs}
                                    defaultColDef={defaultColDef}
                                    pagination={true}
                                    paginationPageSize={10}
                                    theme={themeAlpine}
                                    pinnedBottomRowData={totalRow}
                                    domLayout='autoHeight'
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col md={3}>
                    <div className="switch-container" style={{ float: "right" }}>
                        <label className="switch">
                            <input type="checkbox" checked={isBankGroupBy} onChange={() => setIsBankGroupBy(!isBankGroupBy)} />
                            <span className="slider"></span>
                        </label>
                        <span className="switch-label" style={{ fontSize: "1rem" }}>{isBankGroupBy ? 'Group-by Bank' : 'Group-by Fund-Type'}</span>
                    </div>

                    <MyDoughnut plotData={plotData}/>
                </Col>


            </Row>

        </div >
    )
}

export { SPOFCustom }