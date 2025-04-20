import { readLocalExcel } from "../../scripts/data_reader"

function Play(){
    const saveJsonToFile = (data, filename = 'data.json') => {
        const jsonStr = JSON.stringify(data, null, 2); // pretty print
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
    
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    
        URL.revokeObjectURL(url); // clean up
    };

    function data_download(){
        readLocalExcel("./data/input.xlsx").then((result) => {
            console.log("Check Me : ", result)
            saveJsonToFile(result)
        })
        
    }


    function data_read(){
        readLocalExcel("./data/input.xlsx").then((result) => {
            console.log(result)
        })
    }

    return (
        <div>
            <h1>Hello World</h1>
            <button onClick={data_read}>CLick Me To read Data</button>
            <button onClick={data_download}>Download-Data</button>
        </div>
    )
}

export default Play