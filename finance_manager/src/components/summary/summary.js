import React, { useEffect, useState } from 'react';
import { MyDoughnut } from './doughnut';
import { roundTo } from '../../scripts/utils';

function Summary(props) {
    // const [dbObj, setDbObj] = useState(props.dbObj)
    const [amountVsFundTypeData, setAmountVsFundTypeData] = useState([[], [], 0])
    const [amountVsPrimaryHolderData, setAmountVsPrimaryHolderData] = useState([[], [], 0])
    const [amountVsPrimaryAndSecondaryHolderData, setAmountVsPrimaryAndSecondaryHolderData] = useState([[], [], 0])
    const [amountVsBankTypeData, setAmountVsBankTypeData] = useState([[], [], 0])
    const [liquidStats, setLiquidStats] = useState([[], [], 0])

    useEffect(() => {
        // setDbObj(props.dbObj)
        // Prepare Data for Graph-1 (Allocation Vs Fund-Type)
        setAmountVsFundTypeData(props.dbObj.getAmountVSFundType())
        setAmountVsPrimaryHolderData(props.dbObj.getAmountVSPrimaryHolder())
        setAmountVsPrimaryAndSecondaryHolderData(props.dbObj.getAmountVSPrimaryAndSecondaryHolder())
        setAmountVsBankTypeData(props.dbObj.getAmountVSBankType())
        setLiquidStats(props.dbObj.getLiquidStats())
    }, [props.dbObj])
    

    return (
        <div style={{ border: "5px" }}>
            <h3 style={{ padding: "5px" }}>Percentage(%) Allocations</h3>
            <hr></hr>
            <div className='row'>
                <div className='col-4'>
                    <MyDoughnut plotData={amountVsFundTypeData} title={"Amount (Lakhs) V/S Fund-Type"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(amountVsFundTypeData[2]/100, 2)} Cr</p>
                </div>
                <div className='col-4'>
                    <MyDoughnut plotData={amountVsPrimaryHolderData} title={"Amount (Lakhs) V/S Primary-Holder"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(amountVsPrimaryHolderData[2]/100, 2)} Cr</p>
                </div>
                <div className='col-4'>
                    <MyDoughnut plotData={amountVsPrimaryAndSecondaryHolderData} title={"Amount (Lakhs) V/S Primary & Secondary Holder"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(amountVsPrimaryAndSecondaryHolderData[2]/100, 2)} Cr</p>
                </div>

            </div>
            <div className='row'>
                <div className='col-4'>
                    <MyDoughnut plotData={amountVsBankTypeData} title={"Amount (Lakhs) V/S Bank-Type"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(amountVsBankTypeData[2]/100, 2)} Cr</p>
                </div>
                <div className='col-4'>
                    <MyDoughnut plotData={liquidStats} title={"Liquid V/S Non-Liquid"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(liquidStats[2]/100, 2)} Cr</p>
                </div>
                {/* <div className='col-4'>
                    <MyDoughnut plotData={amountVsPrimaryAndSecondaryHolderData} title={"Amount (Lakhs) V/S Primary & Secondary Holder"}/>
                    <p style={{textAlign:"right"}}>Total: Rs {roundTo(amountVsPrimaryAndSecondaryHolderData[2]/100, 2)} Cr</p>
                </div> */}

            </div>

            <h3 style={{ padding: "5px" }}>Maturity-Details</h3>
            <hr></hr>


        </div>
    )

}

export { Summary }