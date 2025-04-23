import { LightModeNavBar } from "../navbar/navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Summary } from "../summary/summary";
import { Maturity } from "../maturity/maturity";
import { SPOF } from "../spof/spof";
import { useState, useEffect } from "react";
import { readLocalExcel } from "../../scripts/data_reader";
import { JSON_DB } from "../../scripts/json_db";

function HomePage() {
    useState()
    const emptyDbObj = new JSON_DB([])
    const [dbObj, setDbObj] = useState(emptyDbObj)

    useEffect(() => {
        // Load Data from Excel
        readLocalExcel("./data/input.xlsx").then((result) => {
            var dbObj = new JSON_DB(result)
            setDbObj(dbObj)
        })

    }, [])

    return (
        <div>
            <LightModeNavBar />
            <div className="container">
                <Tabs
                    defaultActiveKey="spof"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="summary" title="Total Summary">
                        <Summary dbObj={dbObj}/>
                    </Tab>
                    <Tab eventKey="maturity_planning" title="Maturity Planning">
                        <Maturity dbObj={dbObj}/>
                    </Tab>
                    <Tab eventKey="spof" title="SPOF">
                        <SPOF dbObj={dbObj}/>
                    </Tab>
                    <Tab eventKey="custom" title="Custom">
                        Tab content for Contact
                    </Tab>
                </Tabs>
            </div>

        </div>
    )
}

export { HomePage }