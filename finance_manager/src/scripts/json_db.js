import alasql from 'alasql';
import { convertSqlResultToDoughNutInput } from './utils';

class JSON_DB{
    constructor(raw_data){
        // Dividing the data in 2 parts since, Closed data is required very less as compared to openData which will be queried more
        this.openData = alasql('SELECT * FROM ? WHERE NOT is_closed', [raw_data]);
        this.closedData = alasql('SELECT * FROM ? WHERE is_closed', [raw_data]);
        // console.log("Check Db Object Constructur")
        // console.log("OpenData = ", this.openData)
        // console.log("ClosedData = ", this.closedData)
    }

    sayHello(){
        console.log("Hi I am Db Object, Currently having " + this.openData.length + " items in my open-Data and " + 
        this.closedData.length + " items in my closed data"
        )
    }


    getAmountVSFundType(){
        var query = 'SELECT SUM(amount)/100000 AS amount_lakhs, fund_type FROM ? GROUP BY fund_type ORDER BY amount_lakhs DESC'
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "fund_type", "amount_lakhs")
    }

    getAmountVSPrimaryHolder(){
        var query = 'SELECT SUM(amount)/100000 AS amount_lakhs, primary_holder FROM ? GROUP BY primary_holder ORDER BY amount_lakhs DESC'
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "primary_holder", "amount_lakhs")
    }
}

export {JSON_DB}