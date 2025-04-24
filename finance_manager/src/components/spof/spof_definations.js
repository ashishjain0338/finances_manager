import { CheckCircleFill, XCircleFill } from 'react-bootstrap-icons';
import { Badge, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { DANGER_LEVEL_DEFS } from '../../scripts/constant';
import { capitalizeFirstLetter } from '../../scripts/utils';

function SPOFDefination(props) {

    const [defData, setDefData] = useState()

    useEffect(() => {
        var level = props.level
        var out = []
        var firstLine = true
        if (level >= 1 && level <= 6) {
            var defs = DANGER_LEVEL_DEFS[level]
            for (const def of defs) {
                if(!firstLine){
                    out.push(<br />)
                }
                
                out.push(<h4 style={{ display: 'inline', marginRight: "10px" }}>Level : {props.level} </h4>)
                for (const key of ["primary", "secondary", "nomination"]) {
                    out.push(renderStatus(key, def[key]))
                }
                firstLine = false
            }
        }
        setDefData(out)

    }, [props.level])

    function renderStatus(label, value) {
        label = capitalizeFirstLetter(label)
        return (

            <span className="me-3" style={{ fontSize: "1.1rem" }}>
                <strong>{label}:</strong>{' '}
                {value ? (
                    <Badge bg="success"><CheckCircleFill className="me-1" />Yes</Badge>
                ) : (
                    <Badge bg="danger"><XCircleFill className="me-1" />No</Badge>
                )}
            </span>
        )
    }


    return (
        <div>
            {/* <h4 style={{ display: 'inline', marginRight: "10px" }}>Level : {props.level} </h4> */}
            {defData}
        </div>
    )
}

export { SPOFDefination }