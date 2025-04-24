import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Collapse } from "react-bootstrap";
import { CaretUpFill, CaretDownFill } from '../icons/icons';
import { SPOFSummary } from './spof_summary';
import { SPOFCustom } from './spof_custom';
import "../common_styles/slider-button.css"


function SPOF(props) {
    const [summarySectionCollapse, setSummarySectionCollapse] = useState(true);
    const [customSectionCollapse, setCustomSectionCollapse] = useState(true);
    const [isSumMode, setIsSumMode] = useState(false);
    const [isBankGroupBy, setIsBankGroupBy] = useState(true);
    const handleToggle = () => setIsSumMode(!isSumMode);


    return (
        <div style={{ border: "5px" }}>
            <Row>
                <Col>
                    <h3 style={{ padding: "5px" }}>Summary</h3>
                </Col>
                <Col>

                    <Button className="btn btn-light"
                        onClick={() => setSummarySectionCollapse(!summarySectionCollapse)}
                        style={{ float: "right" }}
                    >
                        {summarySectionCollapse ? <CaretUpFill /> : <CaretDownFill />}
                    </Button>


                    <div className="switch-container" style={{ float: "right", marginRight: "15px" }}>
                        <label className="switch">
                            <input type="checkbox" checked={isSumMode} onChange={handleToggle} />
                            <span className="slider"></span>
                        </label>
                        <span className="switch-label" style={{ fontSize: "1rem" }}>{isSumMode ? 'Sum Mode' : 'Count Mode'}</span>
                    </div>

                    <div className="switch-container" style={{ float: "right", marginRight: "15px" }}>
                        <label className="switch">
                            <input type="checkbox" checked={isBankGroupBy} onChange={() => setIsBankGroupBy(!isBankGroupBy)} />
                            <span className="slider"></span>
                        </label>
                        <span className="switch-label" style={{ fontSize: "1rem" }}>{isBankGroupBy ? 'Group-by Bank' : 'Group-by Fund-Type'}</span>
                    </div>
                </Col>


            </Row>
            <hr></hr>
            <Collapse in={summarySectionCollapse}>
                <div>
                    <SPOFSummary dbObj={props.dbObj} isSumMode={isSumMode} isGroupBybank={isBankGroupBy}/>
                </div>
            </Collapse>

            <Row>
                <Col>
                    <h3 style={{ padding: "5px" }}>Custom</h3>
                </Col>
                <Col>
                    
                    <Button className="btn btn-light"
                        onClick={() => setCustomSectionCollapse(!customSectionCollapse)}
                        style={{ float: "right" }}
                    >
                        {summarySectionCollapse ? <CaretUpFill /> : <CaretDownFill />}
                    </Button>
                </Col>


            </Row>
            <hr></hr>
            <Collapse in={customSectionCollapse}>
                <div>
                    <SPOFCustom dbObj={props.dbObj} isSumMode={isSumMode}/>
                </div>
            </Collapse>
        </div>
    )

}

export { SPOF }