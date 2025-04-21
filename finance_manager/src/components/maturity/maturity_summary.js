import { useEffect } from "react"

function MaturitySummary(props){
    useEffect(() => {
        alert("you got me right")
    }, [props.dbObj])
    
    
    return (
        <div>
            <p>yo</p>
        </div>
    )

}

export {MaturitySummary}