import { LightModeNavBar } from "../navbar/navbar";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { Summary } from "../summary/summary";

function HomePage() {

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
                        <Summary />
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