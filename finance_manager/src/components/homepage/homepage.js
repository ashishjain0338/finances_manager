import { LightModeNavBar } from "../navbar/navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Summary } from "../summary/summary";
import { useState, useEffect } from "react";
import { readLocalExcel } from "../../scripts/data_reader";
import alasql from 'alasql';
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
                    defaultActiveKey="summary"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                    fill
                >
                    <Tab eventKey="summary" title="Total Summary">
                        <Summary dbObj={dbObj}/>
                    </Tab>
                    <Tab eventKey="maturity_planning" title="Maturity Planning">
                        Tab content for Profile
                    </Tab>
                    <Tab eventKey="spof" title="SPOF">
                        Tab content for Contact
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