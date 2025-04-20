import { readDataFromExcel } from "../../scripts/data_reader"

function Play(){

    function data_read(){
        readDataFromExcel("./data/input.xlsx")
    }

    return (
        <div>
            <h1>Hello World</h1>
            <button onClick={data_read}>CLick Me To read Data</button>
        </div>
    )
}

export default Play