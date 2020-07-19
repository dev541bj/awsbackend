var emailService = require("../services/EmailService");
var Util = require("../utils/Utils");

const util = new Util();

class EmailController {
  static async SendMail(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await emailService.sendSESEmail(newOne);
      util.setSuccess(201, "Email Sent!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }
}

module.exports = EmailController;
