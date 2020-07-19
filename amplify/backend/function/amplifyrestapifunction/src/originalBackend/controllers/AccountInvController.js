//import AccountInvService from "../services/AccountInvService";
var AccountInvService = require("../services/AccountInvService");
var Util = require("../utils/Utils");
//import Util from "../utils/Utils";
var moment = require("moment");

const util = new Util();

class AccountInvController {
  static async getAllTransactions(req, res) {
    try {
      const allTransactions = await AccountInvService.getTransactions();
      if (allTransactions.length > 0) {
        util.setSuccess(200, "Transactions retrieved", allTransactions);
      } else {
        util.setSuccess(200, "No Transaction found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getDistinctPayors(req, res) {
    try {
      const destinctPayors = await AccountInvService.getPayors();
      if (destinctPayors.length > 0) {
        util.setSuccess(200, "Payors retrieved", destinctPayors);
      } else {
        util.setSuccess(200, "No payors found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getAllInvoices(req, res) {
    try {
      const allInvoices = await AccountInvService.getInvoices();
      if (allInvoices.length > 0) {
        util.setSuccess(200, "Invoices retrieved", allInvoices);
      } else {
        util.setSuccess(200, "No Invoices found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async deleteOneTransaction(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value");
      return util.send(res);
    }

    try {
      const oneToDelete = await AccountInvService.deleteOneTransaction(id);

      if (oneToDelete) {
        util.setSuccess(200, "Transaction deleted");
      } else {
        util.setError(404, `Transaction with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async deleteManyTransactions(req, res) {
    try {
      const deletedMany = await AccountInvService.deleteManyTransactions(
        req.body
      );
      util.setSuccess(201, "Transactions Deleted!", deletedMany);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async addTransaction(req, res) {
    // if (
    //   !req.body.date ||
    //   !req.body.transType ||
    //   !req.body.payor ||
    //   !req.body.amount ||
    //   !req.body.method
    // ) {
    //   util.setError(400, 'Please provide complete details')
    //   return util.send(res)
    // }
    const newOne = req.body;
    try {
      const createdOne = await AccountInvService.addOneTrans(newOne);
      util.setSuccess(201, "Transaction Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async addManualInvoice(req, res) {
    // if (
    //   !req.body.date ||
    //   !req.body.transType ||
    //   !req.body.payor ||
    //   !req.body.amount ||
    //   !req.body.method
    // ) {
    //   util.setError(400, 'Please provide complete details')
    //   return util.send(res)
    // }
    const newOne = req.body;
    try {
      const { email, startDate, endDate } = newOne;
      const allSessions = await AccountInvController.getDetailAccountsLocal({
        bEmail: email,
      });
      const injected = AccountInvController.injectBalances(
        allSessions.reverse(),
        email
      );
      const filtered = injected.filter((item) => {
        return (
          (moment(new Date(item.date)).isSameOrAfter(startDate) &&
            moment(new Date(item.date)).isSameOrBefore(endDate)) ||
          item.transType == "Payment"
        );
      });
      const finalBalance = (filtered[filtered.length - 1] || { balance: 0 })
        .balance;

      newOne.amount = Math.abs(finalBalance);
      const createdOne = await AccountInvService.addOneManualInvoice(newOne);
      util.setSuccess(201, "Invoice Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  // Accounts Table
  static async getAllAccountsParam(req, res) {
    try {
      const { startDate, endDate, keyword } = req.body;
      const allAccounts = await AccountInvService.getAccountsParam(req.body);
      const resultAccounts = [];
      for (let account of allAccounts) {
        const allSessions = await AccountInvController.getDetailAccountsLocal({
          bEmail: account.billing_email,
          startDate: startDate,
          endDate: endDate,
        });
        const injected = AccountInvController.injectBalances(
          allSessions.reverse(),
          account.billing_email
        );
        const filtered = injected.filter((item) => {
          return (
            (moment(new Date(item.date)).isSameOrAfter(startDate) &&
              moment(new Date(item.date)).isSameOrBefore(endDate)) ||
            item.transType == "Payment"
          );
        });

        const finalBalance = (filtered[filtered.length - 1] || { balance: 0 })
          .balance;

        let lastPayDate = null;
        for (let item of injected.reverse()) {
          if (item.amount != 0 && item.amount != null) {
            lastPayDate = item.date;
          }
        }

        account.balance = finalBalance;
        account.last_pay_date = lastPayDate;

        if (filtered.length > 0) {
          resultAccounts.push(account);
        }
      }

      if (resultAccounts.length > 0) {
        util.setSuccess(200, "Accounts retrieved", resultAccounts);
      } else {
        util.setSuccess(200, "No Accounts found", []);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static injectBalances(accounts, email) {
    const newList = [...accounts];
    let balance = 0;
    for (let account of newList) {
      balance += parseInt(account.amount || 0);
      if (account.session_costs != null) {
        balance -=
          account.session_costs.split(",").length == 1
            ? parseInt(account.session_costs)
            : parseInt(
                account.session_costs.split(",")[
                  account.billing_email.split(",").indexOf(email)
                ]
              );
      } else {
        balance -= parseInt(account.session_cost) || 0;
      }

      account.balance = balance;
    }

    return newList;
  }

  static splitClients(accounts, email) {
    const newList = [];
    for (let account of accounts) {
      if (account.clients == null) {
        newList.push(account);
      } else if (account.clients.split(",").length > 1) {
        for (let i = 0; i < account.clients.split(",").length; i++) {
          let newAccount = Object.assign({}, account);
          newAccount.clients = account.clients.split(",")[i];
          newAccount.session_costs = null;
          newAccount.session_cost =
            (account.session_costs || "").split(",")[i] || 0;
          newAccount.amount = parseInt(
            ("" + (account.amount || "")).split(",")[i] || 0
          );
          if (account.billing_email.split(",").length > 1) {
            if (account.billing_email.split(",")[i] == email) {
              newList.push(newAccount);
            }
          } else {
            newList.push(newAccount);
          }
        }
      } else {
        newList.push(account);
      }
    }

    return newList;
  }

  // Account Details  Table
  static async getDetailAccountsBE(req, res) {
    const data = req.body;
    const { startDate, endDate, bEmail } = data;
    try {
      const detailAccounts = await AccountInvService.getAccountDetailByBE(data);
      const splitAccounts = AccountInvController.splitClients(
        detailAccounts,
        bEmail
      );
      const filtered = AccountInvController.injectBalances(
        splitAccounts.reverse(),
        bEmail
      )
        .reverse()
        .filter((item) => {
          return (
            (moment(new Date(item.date)).isSameOrAfter(startDate) &&
              moment(new Date(item.date)).isSameOrBefore(endDate)) ||
            item.transType == "Payment"
          );
        });

      if (detailAccounts.length > 0) {
        util.setSuccess(200, "Account details retrieved", filtered);
      } else {
        util.setSuccess(200, "No Account details found", []);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getDetailAccountsLocal(data) {
    const { startDate, endDate, bEmail } = data;
    try {
      const detailAccounts = await AccountInvService.getAccountDetailByBE(data);
      const splitAccounts = AccountInvController.splitClients(
        detailAccounts,
        bEmail
      );
      /*const filtered = splitAccounts.filter((item) => {
        return (moment(new Date(item.date))
        .isSameOrAfter(startDate) 
        && moment(new Date(item.date))
        .isSameOrBefore(endDate)) || item.transType == "Payment";
      });*/

      if (splitAccounts.length > 0) {
        return splitAccounts;
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  }
}

//export default AccountInvController;
module.exports = AccountInvController;
