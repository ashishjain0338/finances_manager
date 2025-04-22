import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { deduceCurrentFinancialYear, getFinancialYear } from '../../scripts/utils';
import dayjs from 'dayjs';

function MaturityCustom(props) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    function changeDate(val, mode){
        if(mode == "start"){
            setStartDate(val);
        }else if(mode == "end"){
            setEndDate(val);
        }else if(mode == "both"){
            setStartDate(val[0])
            setEndDate(val[1])
        }
    }

    function changeDateFromDropdown(val){
        if(val == "")
            return;
        if(val[val.length - 1] == 'y'){
            // It is financial year
            var year = parseInt(val.slice(0, val.length - 1))
            changeDate(getFinancialYear(year), "both")
            return;
        }

        const today = dayjs();
        var todayStr = today.format('YYYY-MM-DD')
        let cur;
        switch(val){
            case "-3m":
                cur = today.subtract(3, 'month');
                changeDate([cur.format('YYYY-MM-DD'), todayStr] , "both")
                break;
            case "3m":
                cur = today.add(3, 'month');
                changeDate([todayStr, cur.format('YYYY-MM-DD')] , "both")
                break;
            case "6m":
                cur = today.add(6, 'month');
                changeDate([todayStr, cur.format('YYYY-MM-DD')] , "both")
                break;
            default:

        }

    }

    function getNextFinancialYearForDropDown(){
        var currentFY = deduceCurrentFinancialYear()
        var dropDownOptions = [
            <option value={(currentFY - 1) + "y"}>F.Y. {currentFY - 1} (Prev)</option>,
            <option value={currentFY + "y"}>F.Y. {currentFY} (Current)</option>
        ]
        for(var i = 0 ; i < 3; i++){
            var curYear = currentFY + i + 1
            dropDownOptions.push( <option value={curYear + "y"}>F.Y. {curYear}</option>)
        }
        return dropDownOptions
    }

    return (
        <div>
            <Form>
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
                                <option value="3m">Next 3 Months</option>
                                <option value="6m">Next 6 Months</option>
                                {getNextFinancialYearForDropDown()}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        </div>
    )

}

export { MaturityCustom }