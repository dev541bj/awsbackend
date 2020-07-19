var cognitoService = require("../services/CognitoService");
var Util = require("../utils/Utils");

const util = new Util();

class CognitoController {
  static async Register(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await cognitoService.registerMember(newOne);

      util.setSuccess(201, "User signed up!", createdOne);
      //console.log("here's the created one", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }
}

module.exports = CognitoController;
