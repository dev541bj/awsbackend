//import MessageService from "../services/MessageService";
var MessageService = require("../services/MessageService");
//import Util from "../utils/Utils";
var Util = require("../utils/Utils");

const util = new Util();

class MessageController {
  static async getAllMessages(req, res) {
    try {
      const allClients = await MessageService.getAllMessages();
      if (allClients.length > 0) {
        util.setSuccess(200, "Messages retrieved", allClients);
      } else {
        util.setSuccess(200, "No Messages found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

// export default MessageController;
module.exports = MessageController;
