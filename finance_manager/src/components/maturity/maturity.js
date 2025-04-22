import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Collapse } from "react-bootstrap";
import { CaretUpFill, CaretDownFill } from '../icons/icons';
import { MaturitySummary } from './maturity_summary';
import { MaturityCustom } from './maturity_custom';
import "./slider-button.css"

function Maturity(props) {


    const [summarySectionCollapse, setSummarySectionCollapse] = useState(true);
    const [customSectionCollapse, setCustomSectionCollapse] = useState(true);
    const [isSumMode, setIsSumMode] = useState(false);
    const handleToggle = () => setIsSumMode(!isSumMode);

    useEffect(() => {
    }, [props.dbObj])

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
                        <span className="switch-label" style={{fontSize: "1rem"}}>{isSumMode ? 'Sum Mode' : 'Count Mode'}</span>
                    </div>
                </Col>


            </Row>
            <hr></hr>
            <Collapse in={summarySectionCollapse}>
                <div>
                    <MaturitySummary dbObj={props.dbObj} isSumMode={isSumMode}/>
                </div>
            </Collapse>


            {/* <h3 style={{ padding: "5px" }}>Custom</h3>
            <hr></hr> */}
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
                    <MaturityCustom dbObj={props.dbObj} isSumMode={isSumMode}/>
                </div>
            </Collapse>
        </div>
    )
}

export { Maturity }