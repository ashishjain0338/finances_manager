import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useState, useEffect, useMemo } from 'react';
import { deduceCurrentFinancialYear, getFinancialYear, convertToIndiaCommaNotationFxn } from '../../scripts/utils';
import dayjs from 'dayjs';
import { getCurrentDate, formatColDataForAGGrid } from "../../scripts/utils";
import { DUMMMY_AGGRID_COLDEFS, DUMMMY_AGGRID_DATA } from "../../scripts/constant";
import { CustomMaturityDoughnut } from './maturity_custom_doughnut';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { themeAlpine } from "ag-grid-community";
import "./ag-grid.css"



// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

function MaturityCustom(props) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);
    const [totalRow, setTotalRow] = useState([])
    const [cached, setCached] = useState({})

    // Apply settings across all columns
    const defaultColDef = useMemo(() => ({
        filter: true, // Enable filtering on all columns
        // flex:1,
    }))


    function setMaturityData(start, end) {
        if (start == "" || end == "")
            return;
        var [data, tot_row] = props.dbObj.getMaturityData(start, end);
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
        console.log("Check-Me : ", data)
    }

    function changeDate(val, mode) {
        if (mode == "start") {
            setStartDate(val);
            setMaturityData(val, endDate)
        } else if (mode == "end") {
            setEndDate(val);
            setMaturityData(startDate, val)
        } else if (mode == "both") {
            setStartDate(val[0])
            setEndDate(val[1])
            setMaturityData(val[0], val[1])
        }

    }

    function changeDateFromDropdown(val) {
        if (val == "")
            return;
        if (val[val.length - 1] == 'y') {
            // It is financial year
            var year = parseInt(val.slice(0, val.length - 1))
            changeDate(getFinancialYear(year), "both")
            return;
        }

        const today = dayjs();
        var todayStr = today.format('YYYY-MM-DD')
        let cur;
        switch (val) {
            case "-3m":
                cur = today.subtract(3, 'month');
                changeDate([cur.format('YYYY-MM-DD'), todayStr], "both")
                break;
            case "1m":
                cur = today.add(1, 'month');
                changeDate([todayStr, cur.format('YYYY-MM-DD')], "both")
                break;
            case "3m":
                cur = today.add(3, 'month');
                changeDate([todayStr, cur.format('YYYY-MM-DD')], "both")
                break;
            case "6m":
                cur = today.add(6, 'month');
                changeDate([todayStr, cur.format('YYYY-MM-DD')], "both")
                break;
            default:

        }

    }

    function getNextFinancialYearForDropDown() {
        var currentFY = deduceCurrentFinancialYear()
        var dropDownOptions = [
            <option value={(currentFY - 1) + "y"}>F.Y. {currentFY - 1} (Prev)</option>,
            <option value={currentFY + "y"}>F.Y. {currentFY} (Current)</option>
        ]
        for (var i = 0; i < 3; i++) {
            var curYear = currentFY + i + 1
            dropDownOptions.push(<option value={curYear + "y"}>F.Y. {curYear}</option>)
        }
        return dropDownOptions
    }

    return (
        <div>
            <Form>
                {/* For Time-Period Input */}
                <Row className="align-items-center">
                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <InputGroup size="mb">
                                <InputGroup.Text>Time Period: </InputGroup.Text>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => changeDate(e.target.value, "start")}
                                />
                                <InputGroup.Text>To</InputGroup.Text>
                                <Form.Control
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => changeDate(e.target.value, "end")}
                                />

                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={3} className="offset-3">
                        <Form.Group controlId="rangeSelect">
                            <Form.Select onChange={(e) => changeDateFromDropdown(e.target.value)}>
                                <option value="">Pre-Defined Ranges</option>
                                <option value="-3m">Last 3 Months</option>
                                <option value="1m">Next Month</option>
                                <option value="3m">Next 3 Months</option>
                                <option value="6m">Next 6 Months</option>
                                {getNextFinancialYearForDropDown()}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
                <hr />
                {/* AG-Grid */}
                <Row>
                    <Col md={9} xs={12}>
                        <div className="ag-theme-alpine" style={{ height: 400 }}>
                            <AgGridReact
                                rowData={rowData}
                                columnDefs={colDefs}
                                defaultColDef={defaultColDef}
                                // pagination={true}
                                theme={themeAlpine}
                                pinnedBottomRowData={totalRow}
                                domLayout='autoHeight'
                            />
                        </div>

                    </Col>
                    <Col md={3} xs={12}>
                        <CustomMaturityDoughnut gridData={rowData} />
                    </Col>
                </Row>
            </Form>
        </div>
    )

}

export { MaturityCustom }