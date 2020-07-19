// import { query } from "./connection";
var query = require("./dbConnection");

class AccountInvService {
  static async getTransactions() {
    var sql = `SELECT id, DATE_FORMAT(trans_date, '%m/%d/%Y') as transDate, transType, payor, amount, method, description 
      from testevent 
      WHERE transType = 'Payment' OR transType = 'Discount' or transType = 'Refund' ORDER BY transDate DESC`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async getPayors() {
    let sql = "SELECT DISTINCT billing_full_name, billing_email FROM clients";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  // Accounts table
  static async getAccountsParam(param) {
    const { keyword } = param;
    const sql = `SELECT 
                    y.payor, 
                    y.billing_email, 
                    y.billing_full_name, 
                    y.client_type, 
                    y.billing_phone, 
                    y.payment_type, 
                    y.client 
                  FROM 
                    (SELECT 
                      CONCAT_WS(', ', billing_last_name, billing_first_name) AS payor, 
                      billing_email, 
                      billing_full_name, 
                      client_type, 
                      billing_phone, 
                      payment_type, 
                      GROUP_CONCAT(client_full_name SEPARATOR ', ') AS client 
                    FROM 
                      nodemysql.clients GROUP BY payor , 
                      billing_email , 
                      billing_full_name ,
                      client_type , 
                      client_type , 
                      billing_phone , 
                      payment_type) as y `;
    const groupByClause = ` group by  
                            y.payor, 
                            y.billing_email, 
                            y.billing_full_name, 
                            y.client_type, 
                            y.billing_phone, 
                            y.payment_type, 
                            y.client`;
    let whereClasue = ``;
    if (keyword.length > 0) {
      const keywordClause = ` y.payor LIKE '%${keyword}%' OR
                              y.billing_email LIKE '%${keyword}%' OR
                              y.billing_full_name LIKE '%${keyword}%' OR
                              y.client_type LIKE '%${keyword}%' OR
                              y.billing_phone LIKE '%${keyword}%' OR
                              y.payment_type LIKE '%${keyword}%' OR
                              y.client LIKE '%${keyword}%' `;
      if (whereClasue.length > 0) {
        whereClasue = whereClasue + ` AND ${keywordClause} `;
      } else {
        whereClasue = ` WHERE ${keywordClause} `;
      }
    }
    try {
      return await query(sql + whereClasue + groupByClause);
    } catch (error) {
      throw error;
    }
  }

  // Account Details
  static async getAccountDetailByBE(param) {
    const { bEmail } = param;
    let sql = `SELECT 
                  DATE_FORMAT(x.trans_date, '%m/%d/%Y') as date,
                  x.description,  
                  x.clients, 
                  x.session_costs, 
                  x.session_cost,
                  x.amount,
                  x.billing_email,
                  x.payor
                FROM 
                  (SELECT * FROM testevent WHERE billing_email LIKE '%${bEmail}%') x
                WHERE 
                  trans_date IS NOT NULL
                GROUP BY 
                  x.id 
                ORDER BY 
                  x.trans_date DESC`;

    try {
      let res = await query(sql);
      return res;
    } catch (error) {
      throw error;
    }
  }

  static async getInvoices() {
    var sql = `SELECT id, status,  DATE_FORMAT(inv_date, '%m/%d/%Y') as inv_date, payor, DATE_FORMAT(start_date, 
        '%m/%d/%Y') as start_date, DATE_FORMAT(end_date, '%m/%d/%Y') as end_date, amount 
        from invoices`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async deleteOneTransaction(id) {
    const sql = `DELETE FROM testevent WHERE id = ${id}`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async addOneTrans(newOne) {
    const sql = `INSERT INTO testevent (transType, payor, amount, method, description, billing_email, trans_date) 
      VALUES (?,?,?,?,?,?,?) `;
    const {
      transType,
      payor,
      amount,
      method,
      description,
      billingEmail,
      transDate,
    } = newOne;

    try {
      return await query(sql, [
        transType,
        payor,
        amount,
        method,
        description,
        billingEmail,
        transDate,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async addOneManualInvoice(newOne) {
    const sql =
      "INSERT INTO invoices (inv_date, payor, billing_email, start_date, end_date, amount) VALUES (?, ?, ?, ?, ?, ?) ";
    const { invoiceDate, payor, email, startDate, endDate, amount } = newOne;

    try {
      return await query(sql, [
        invoiceDate,
        payor,
        email,
        startDate,
        endDate,
        amount,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async deleteManyTransactions(ids) {
    if (!ids || ids.length === 0) throw Error("ids not valid.");
    let sql = "DELETE FROM testevent WHERE id IN (";
    for (const id of ids) {
      sql += id + ", ";
    }

    sql = sql.substr(0, sql.length - 2);
    sql += ")";

    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }
}

//export default AccountInvService;
module.exports = AccountInvService;
