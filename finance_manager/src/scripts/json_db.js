import alasql from 'alasql';
import { convertSqlResultToDoughNutInput, getCurrentDate, getFinancialYear, deduceCurrentFinancialYear } from './utils';

class JSON_DB {
    constructor(raw_data) {
        // Dividing the data in 2 parts since, Closed data is required very less as compared to openData which will be queried more
        this.openData = alasql('SELECT * FROM ? WHERE NOT is_closed', [raw_data]);
        this.closedData = alasql('SELECT * FROM ? WHERE is_closed', [raw_data]);
        // console.log("Check Db Object Constructur")
        // console.log("OpenData = ", this.openData)
        // console.log("ClosedData = ", this.closedData)
    }

    sayHello() {
        console.log("Hi I am Db Object, Currently having " + this.openData.length + " items in my open-Data and " +
            this.closedData.length + " items in my closed data"
        )
    }


    getAmountVSFundType() {
        var query = 'SELECT SUM(amount)/100000 AS amount_lakhs, fund_type FROM ? GROUP BY fund_type ORDER BY amount_lakhs DESC'
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "fund_type", "amount_lakhs")
    }

    getAmountVSPrimaryHolder() {
        var query = `
            SELECT 
            SUM(amount)/100000 AS amount_lakhs, primary_holder 
            FROM ? 
            GROUP BY primary_holder 
            ORDER BY amount_lakhs DESC`
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "primary_holder", "amount_lakhs")
    }

    getAmountVSPrimaryAndSecondaryHolder() {
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

    getAmountVSBankType() {
        var query = `
            SELECT 
            SUM(amount)/100000 AS amount_lakhs, bank_name 
            FROM ? 
            GROUP BY bank_name 
            ORDER BY amount_lakhs DESC`
        const result = alasql(query, [this.openData])
        return convertSqlResultToDoughNutInput(result, "bank_name", "amount_lakhs")
    }

    getLiquidStats() {
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

    getTotalSumRow(data, exclude_columns = [], include_columns = ["*"]) {
        
        if (data.length == 0)
            return {}
        var headers = Object.keys(data[0])
        var tot_row = {}
        if (include_columns[0] == "*"){
            // All columns except excluding
            for (var i = 0; i < headers.length; i++) {
                if (!exclude_columns.includes(headers[i])) {
                    tot_row[headers[i]] = 0;
                }
    
            }
    
            for (var i = 0; i < data.length; i++) {
                var curData = data[i]
                for (var j = 0; j < headers.length; j++) {
                    if (!exclude_columns.includes(headers[j])) {
                        tot_row[headers[j]] += curData[headers[j]];
                    }
                }
            }
        }else{
            // only go for include columns, ignore exlude columns
            for (var i = 0; i < headers.length; i++) {
                if (include_columns.includes(headers[i])) {
                    tot_row[headers[i]] = 0;
                }
            }
            for (var i = 0; i < data.length; i++) {
                var curData = data[i]
                for (var j = 0; j < headers.length; j++) {
                    if (include_columns.includes(headers[j])) {
                        tot_row[headers[j]] += curData[headers[j]];
                    }
                }
            }
        }
        return tot_row

    }

    getMaturityForNextNyearsCount(n = 3) {
        // Build the query
        var currentDate = getCurrentDate()
        var curFinYear = deduceCurrentFinancialYear()
        // Next 3 Financial-Year Clause
        var next_year_clause = ""
        for (var i = 0; i < n; i++) {
            var year = curFinYear + i + 1
            var nextFinYear = getFinancialYear(year)
            next_year_clause += `
                 SUM( 
                     CASE 
                         WHEN 
                             DATE(maturity_date) >= DATE('${nextFinYear[0]}')
                             AND 
                             DATE(maturity_date) <= DATE('${nextFinYear[1]}')
                         THEN 1 
                         ELSE 0 
                     END
                 ) AS maturing_in_${year}
             `
            if (i != n - 1) {
                next_year_clause += ','
            }
        }

        var query = `
         SELECT 
             fund_type,
             SUM(CASE WHEN DATE(maturity_date) < DATE('${currentDate}') THEN 1 ELSE 0 END) AS matured,
             SUM( 
                 CASE 
                     WHEN 
                         DATE(maturity_date) > DATE('${currentDate}')
                         AND 
                         DATE(maturity_date) <= DATE('${getFinancialYear(curFinYear)[1]}')
                     THEN 1 
                     ELSE 0 
                 END
             ) AS maturing_in_${curFinYear},
             ${next_year_clause}
             FROM ?
             GROUP BY fund_type
         `
        const result = alasql(query, [this.openData])
        return result
    }

    getMaturityForNextNyearsSum(n = 3) {
        // Build the query
        var currentDate = getCurrentDate()
        var curFinYear = deduceCurrentFinancialYear()
        // Next 3 Financial-Year Clause
        var next_year_clause = ""
        for (var i = 0; i < n; i++) {
            var year = curFinYear + i + 1
            var nextFinYear = getFinancialYear(year)
            next_year_clause += `
                 SUM( 
                     CASE 
                         WHEN 
                             DATE(maturity_date) >= DATE('${nextFinYear[0]}')
                             AND 
                             DATE(maturity_date) <= DATE('${nextFinYear[1]}')
                         THEN amount 
                         ELSE 0 
                     END
                 ) AS maturing_in_${year}
             `
            if (i != n - 1) {
                next_year_clause += ','
            }
        }

        var query = `
         SELECT 
             fund_type,
             SUM(CASE WHEN DATE(maturity_date) < DATE('${currentDate}') THEN amount ELSE 0 END) AS matured,
             SUM( 
                 CASE 
                     WHEN 
                         DATE(maturity_date) > DATE('${currentDate}')
                         AND 
                         DATE(maturity_date) <= DATE('${getFinancialYear(curFinYear)[1]}')
                     THEN amount 
                     ELSE 0 
                 END
             ) AS maturing_in_${curFinYear},
             ${next_year_clause}
             FROM ?
             GROUP BY fund_type
         `
        const result = alasql(query, [this.openData])
        return result
    }

    getClosedByFundTypeCount() {
        var query = `
            SELECT COUNT(*) as closed, fund_type FROM ? GROUP BY fund_type 
        `
        const result = alasql(query, [this.closedData])
        return result
    }

    getClosedByFundTypeSum() {
        var query = `
            SELECT SUM(amount) as closed, fund_type FROM ? GROUP BY fund_type 
        `
        const result = alasql(query, [this.closedData])
        return result
    }

    getMaturitySummary(mode) {
        
        var mature_result, closed_result
        switch(mode){
            case "count":
                mature_result = this.getMaturityForNextNyearsCount(5)
                closed_result = this.getClosedByFundTypeCount()
            break;
            case "sum":
                mature_result = this.getMaturityForNextNyearsSum(5)
                closed_result = this.getClosedByFundTypeSum()
                break;
            default:

        }

        if (mature_result.length == 0 && closed_result.length == 0) {
            // This is when data is not loaded
            return [[],[]]
        }
        // join both tables
        var headers_mature_table = Object.keys(mature_result[0])
        var mature_table_cols = ""
        for (var i = 0; i < headers_mature_table.length; i++) {
            mature_table_cols += `f.${headers_mature_table[i]}, `
        }

        const query = `
        SELECT ${mature_table_cols} i.closed
        FROM ? AS f
        JOIN ? AS i ON f.fund_type = i.fund_type
        `;
        const result = alasql(query, [mature_result, closed_result])
        var total_row = this.getTotalSumRow(result, ["fund_type"])
        total_row['fund_type'] = "Total"
        // result.push(total_row)
        return [result, [total_row]]

    }

    getMaturityData(start, end){
        var query = `
            SELECT 
            bank_name as Bank, fund_type, fund_number, amount, maturity_date, primary_holder, secondary_holder, nomination 
            FROM ?
            WHERE DATE(maturity_date) >= DATE('${start}') AND DATE(maturity_date) <= DATE('${end}')
            ORDER BY DATE(maturity_date)
        `
        const result = alasql(query, [this.openData])
        var tot_row = this.getTotalSumRow(result, [], ["amount"])
        tot_row["Bank"] = "Total"
        return [result, [tot_row]]
    }

}

export { JSON_DB }