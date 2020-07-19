var query = require("./dbConnection");
var moment = require("moment");

class CategoryService {
  static async insertOne(newOne) {
    const value = newOne.value;
    const color = newOne.color;
    const sql =
      "INSERT INTO categories(name, color) values('" +
      value +
      "', '" +
      color +
      "')";
    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async getAll() {
    var sql = "SELECT * FROM categories";
    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CategoryService;
