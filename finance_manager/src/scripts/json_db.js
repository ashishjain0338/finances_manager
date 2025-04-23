import alasql from 'alasql';
import {
    convertSqlResultToDoughNutInput, getCurrentDate, getFinancialYear, deduceCurrentFinancialYear, checkSpofCondition
    , getValFromJSObject
} from './utils';

class JSON_DB {
    constructor(raw_data) {
        // Dividing the data in 2 parts since, Closed data is required very less as compared to openData which will be queried more
        this.openData = alasql('SELECT * FROM ? WHERE NOT is_closed', [raw_data]);
        this.closedData = alasql('SELECT * FROM ? WHERE is_closed', [raw_data]);
        this.precomputedSPOFData = this.computeSPOFData()
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
        var headers = Object.keys(data[0]) // ToDo: The problem with this is sometimes, first-row doesn't contain all columns, so inconsistent headers 
        var tot_row = {}
        if (include_columns[0] == "*") {
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
                        tot_row[headers[j]] += getValFromJSObject(curData, headers[j]);
                    }
                }
            }
        } else {
            // only go for include columns, ignore exlude columns
            for (var i = 0; i < include_columns.length; i++) {
                tot_row[include_columns[i]] = 0;
            }
            for (var i = 0; i < data.length; i++) {
                var curData = data[i]
                for (var j = 0; j < include_columns.length; j++) {
                    var col = include_columns[j]
                    tot_row[col] += getValFromJSObject(curData, col);
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
        switch (mode) {
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
            return [[], []]
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

    getMaturityData(start, end) {
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


    computeSPOFData() {
        /*
            Since the Data is less and Sql query is way long, we will just iterate over and store the data
        */
        var dangerLevels = []
        for (var i = 0; i < 6; i++) {// 6 Levels
            dangerLevels.push([])
        }
        for (const row of this.openData) {
            var p = checkSpofCondition(row["primary_holder"]), s = checkSpofCondition(row["secondary_holder"]), n = checkSpofCondition(row["nomination"])
            // console.log(p, s, n)
            var dangerLevelIndex = 0;

            if (p && s && n) {
                // Danger Level-I: No Primary, No Secondary, No Nominee
                dangerLevelIndex = 0;
            } else if (p && s && !n) {
                // Danger Level-2: No Primary, No Secondary, Yes Nominee
                dangerLevelIndex = 1;
            } else if ((!p && s && n) || (p && !s && n)) {
                // Danger Level-3: Yes Primary, No Secondary, No Nominee OR No Primary, Yes Secondary, No Nominee
                dangerLevelIndex = 2;
            } else if ((!p && s && !n) || (p && !s && !n)) {
                // Danger Level-4: Yes Primary, No Secondary, Yes Nominee OR No Primary, Yes Secondary, Yes Nominee
                dangerLevelIndex = 3;
            } else if (!p && !s && n) {
                // Danger Level-5: Yes Primary, Yes Secondary, No Nominee
                dangerLevelIndex = 4;
            } else if (!p && !s && !n) {
                // Secured: Yes Primary, Yes Secondary, Yes Nominee
                dangerLevelIndex = 5;
            } else {
                console.warn("Following Row belong to no danger level| Why!!", row)
            }
            dangerLevels[dangerLevelIndex].push(row)


        }
        return dangerLevels
    }

    getSPOFCount(groupByCol = "bank_name") {
        var subqueryResults = []
        // Run Subquery
        for (var i = 0; i < this.precomputedSPOFData.length; i++) {
            var query = `
                SELECT ${groupByCol}, COUNT(*) AS dangerLevel${i + 1}
                FROM ?
                GROUP BY ${groupByCol}
            `
            subqueryResults.push(alasql(query, [this.precomputedSPOFData[i]]))
        }
        // console.log("Here",subqueryResults)

        // Merge Subquery Results
        /*
            Converting:
            [[{A: 1, B: 2}, {A: 2, B: 3}], [{A: 2, C: 1}, {A: 3, C: 5}]]

            To: (A is group by Column)
            [
                {A: 1}, {B: 2},
                {A: 2}, {B : 3}, {C, 1},
                {A: 3}, {C: 5}
            ]
        */
        var indexMap = {}
        var out = []
        var cols = [groupByCol, "dangerLevel1", "dangerLevel2", "dangerLevel3", "dangerLevel4", "dangerLevel5", "dangerLevel6"]
        for (var i = 0; i < subqueryResults.length; i++) {
            for (var j = 0; j < subqueryResults[i].length; j++) {
                var row = subqueryResults[i][j];
                var groupByColVal = row[groupByCol];
                var valKey = `dangerLevel${i + 1}`
                if (Object.keys(indexMap).includes(groupByColVal)) {
                    out[indexMap[groupByColVal]][valKey] = row[valKey]
                } else {
                    // New Entry
                    var add = {}
                    // Add current-Val and also the group by column
                    add[valKey] = row[valKey]
                    add[groupByCol] = groupByColVal
                    out.push(add)
                    // Update index in indexMap
                    indexMap[groupByColVal] = out.length - 1;//Last Index
                }
            }
        }
        return out;
    }

    getSPOFSum(groupByCol = "bank_name") {
        var subqueryResults = []
        // Run Subquery
        for (var i = 0; i < this.precomputedSPOFData.length; i++) {
            var query = `
                SELECT ${groupByCol}, SUM(amount) AS dangerLevel${i + 1}
                FROM ?
                GROUP BY ${groupByCol}
            `
            subqueryResults.push(alasql(query, [this.precomputedSPOFData[i]]))
        }
        // console.log("Here",subqueryResults)

        // Merge Subquery Results
        /*
            Converting:
            [[{A: 1, B: 2}, {A: 2, B: 3}], [{A: 2, C: 1}, {A: 3, C: 5}]]

            To: (A is group by Column)
            [
                {A: 1}, {B: 2},
                {A: 2}, {B : 3}, {C, 1},
                {A: 3}, {C: 5}
            ]
        */
        var indexMap = {}
        var out = []
        var cols = [groupByCol, "dangerLevel1", "dangerLevel2", "dangerLevel3", "dangerLevel4", "dangerLevel5", "dangerLevel6"]
        for (var i = 0; i < subqueryResults.length; i++) {
            for (var j = 0; j < subqueryResults[i].length; j++) {
                var row = subqueryResults[i][j];
                var groupByColVal = row[groupByCol];
                var valKey = `dangerLevel${i + 1}`
                if (Object.keys(indexMap).includes(groupByColVal)) {
                    out[indexMap[groupByColVal]][valKey] = row[valKey]
                } else {
                    // New Entry
                    var add = {}
                    // Add current-Val and also the group by column
                    add[valKey] = row[valKey]
                    add[groupByCol] = groupByColVal
                    out.push(add)
                    // Update index in indexMap
                    indexMap[groupByColVal] = out.length - 1;//Last Index
                }
            }
        }
        return out;
    }

    getSPOFSummary(groupByCol, mode) {
        var data = []
        switch (mode) {
            case "count":
                data = this.getSPOFCount(groupByCol)
                break;
            case "sum":
                data = this.getSPOFSum(groupByCol)
                break;
            default:
                break;
        }
        if (data.length == 0) {
            return [[], [], {}];
        }
        // Process the data, Add a Total-Row
        var include_columns = ["dangerLevel1", "dangerLevel2", "dangerLevel3", "dangerLevel4", "dangerLevel5", "dangerLevel6"]
        var total_row = this.getTotalSumRow(data, [], include_columns)
        var headers = [groupByCol, "dangerLevel1", "dangerLevel2", "dangerLevel3", "dangerLevel4", "dangerLevel5", "dangerLevel6"]
        return [data, headers, total_row]

    }

}

export { JSON_DB }