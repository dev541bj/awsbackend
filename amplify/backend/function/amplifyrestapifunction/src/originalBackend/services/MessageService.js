// import { query } from "./connection";
var query = require("./dbConnection");

class MessageService {
  static async getAllMessages() {
    const sql =
      "SELECT id, contact, subject, DATE_FORMAT(date, '%m/%d/%Y') as date FROM messages";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }
}

// export default MessageService;
module.exports = MessageService;
