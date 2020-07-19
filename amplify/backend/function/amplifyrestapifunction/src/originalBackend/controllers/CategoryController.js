var categoryService = require("../services/CategoryService");
var Util = require("../utils/Utils");

const util = new Util();

class CategoryController {
  static async insert(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await categoryService.insertOne(newOne);
      util.setSuccess(201, "Category Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async getAllCategories(req, res) {
    try {
      const allCategories = await categoryService.getAll();
      if (allCategories.length > 0) {
        util.setSuccess(200, "Categories retrieved", allCategories);
      } else {
        util.setSuccess(200, "No Client found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

module.exports = CategoryController;
