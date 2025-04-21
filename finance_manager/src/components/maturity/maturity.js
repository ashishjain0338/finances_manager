import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Collapse } from "react-bootstrap";
import { CaretUpFill, CaretDownFill } from '../icons/icons';
import { MaturitySummary } from './maturity_summary';


function Maturity(props){
    const [amountVsFundTypeData, setAmountVsFundTypeData] = useState([[], [], 0])
    const [amountVsPrimaryHolderData, setAmountVsPrimaryHolderData] = useState([[], [], 0])
    const [amountVsPrimaryAndSecondaryHolderData, setAmountVsPrimaryAndSecondaryHolderData] = useState([[], [], 0])
    const [amountVsBankTypeData, setAmountVsBankTypeData] = useState([[], [], 0])
    const [liquidStats, setLiquidStats] = useState([[], [], 0])

    const [summarySectionCollapse, setSummarySectionCollapse] = useState(true);

    useEffect(() => {
        // // setDbObj(props.dbObj)
        // // Prepare Data for Graph-1 (Allocation Vs Fund-Type)
        // setAmountVsFundTypeData(props.dbObj.getAmountVSFundType())
        // setAmountVsPrimaryHolderData(props.dbObj.getAmountVSPrimaryHolder())
        // setAmountVsPrimaryAndSecondaryHolderData(props.dbObj.getAmountVSPrimaryAndSecondaryHolder())
        // setAmountVsBankTypeData(props.dbObj.getAmountVSBankType())
        // setLiquidStats(props.dbObj.getLiquidStats())
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
                </Col>


            </Row>

            <hr></hr>
            <Collapse in={summarySectionCollapse}>
                <div>
                    <MaturitySummary dbObj={props.dbObj}/>
                </div>
            </Collapse>


            {/* <h3 style={{ padding: "5px" }}>Custom</h3>
            <hr></hr> */}


        </div>
    )
}

export {Maturity}