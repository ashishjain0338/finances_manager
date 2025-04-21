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
        var query = `
            SELECT 
            SUM(amount)/100000 AS amount_lakhs, primary_holder 
            FROM ? 
            GROUP BY primary_holder 
            ORDER BY amount_lakhs DESC`
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "primary_holder", "amount_lakhs")
    }

    getAmountVSPrimaryAndSecondaryHolder(){
        var query = `
            SELECT 
            SUM(amount)/100000 AS amount_lakhs, 
            CONCAT(primary_holder, '_',secondary_holder) as joint_holder
            FROM ? 
            GROUP BY CONCAT(primary_holder, '_',secondary_holder) 
            ORDER BY amount_lakhs DESC`
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "joint_holder", "amount_lakhs")
    }

    getAmountVSBankType(){
        var query = `
            SELECT 
            SUM(amount)/100000 AS amount_lakhs, bank_name 
            FROM ? 
            GROUP BY bank_name 
            ORDER BY amount_lakhs DESC`
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "bank_name", "amount_lakhs")
    }

    getLiquidStats(){
        /*
            All the Amount in Savings & Salary is considered Liquid whereas other are considered locked
        */
       var liquid_query = `
       SELECT
       SUM(amount)/100000 AS amount_lakhs 
       FROM ?
       WHERE fund_type = "Salary" OR fund_type = "Savings"
       `   
       const result_liquid = alasql(liquid_query, [this.openData])
    
       var non_liquid_query = `
       SELECT
       SUM(amount)/100000 AS amount_lakhs 
       FROM ?
       WHERE fund_type != "Salary" AND fund_type != "Savings"
       `
       const result_non_liquid = alasql(non_liquid_query, [this.openData])
       const liquid = result_liquid[0]["amount_lakhs"], non_liquid = result_non_liquid[0]["amount_lakhs"]
       return [["Liquid", "Non-Liquid"], [liquid, non_liquid], liquid + non_liquid]
    }
}

export {JSON_DB}