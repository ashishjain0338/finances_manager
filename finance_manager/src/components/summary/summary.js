import React, { useEffect, useState } from 'react';
import { MyDoughnut } from './doughnut';
import { roundTo } from '../../scripts/utils';

function Summary(props) {
    // const [dbObj, setDbObj] = useState(props.dbObj)
    const [amountVsFundTypeData, setAmountVsFundTypeData] = useState([[], [], 0])
    const [amountVsPrimaryHolderData, setAmountVsPrimaryHolderData] = useState([[], [], 0])

    useEffect(() => {
        // setDbObj(props.dbObj)
        // Prepare Data for Graph-1 (Allocation Vs Fund-Type)
        setAmountVsFundTypeData(props.dbObj.getAmountVSFundType())
        setAmountVsPrimaryHolderData(props.dbObj.getAmountVSPrimaryHolder())
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

            </div>


        </div>
    )

}

export { Summary }