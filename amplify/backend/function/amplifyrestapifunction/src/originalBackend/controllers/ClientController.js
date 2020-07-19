//import ClientService from "../services/ClientService";
var ClientService = require("../services/ClientService");
//import Util from "../utils/Utils";
var Util = require("../utils/Utils");

const util = new Util();

class ClientController {
  static async getAllClients(req, res) {
    try {
      const allClients = await ClientService.getAllClients();
      if (allClients.length > 0) {
        util.setSuccess(200, "Clients retrieved", allClients);
      } else {
        util.setSuccess(200, "No Client found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getActiveClients(req, res) {
    try {
      const activeClients = await ClientService.getActiveClients();
      if (activeClients.length > 0) {
        util.setSuccess(200, "Clients retrieved", activeClients);
      } else {
        util.setSuccess(200, "No Client found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getAllPayors(req, res) {
    try {
      const records = await ClientService.getAllPayors();
      if (records.length > 0) {
        util.setSuccess(200, "Payors retrieved", records);
      } else {
        util.setSuccess(200, "No Payor found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getAllFacilities(req, res) {
    try {
      const records = await ClientService.getAllFacilities();
      if (records.length > 0) {
        util.setSuccess(200, "Facilities retrieved", records);
      } else {
        util.setSuccess(200, "No Facility found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addClient(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await ClientService.addOne(newOne);
      util.setSuccess(201, "Client Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async deleteOne(req, res) {
    const { id } = req.params;

    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value");
      return util.send(res);
    }

    try {
      const oneToDelete = await ClientService.deleteOne(id);

      if (oneToDelete) {
        util.setSuccess(200, "Client deleted");
      } else {
        util.setError(404, `Client with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async totalClients(req, res) {
    try {
      const records = await ClientService.totalClients();
      if (records.length > 0) {
        util.setSuccess(200, "Client num retrieved", records);
      } else {
        util.setSuccess(200, "No client num found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updateClientInfo(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await ClientService.updateInfo(updateOne);
      util.setSuccess(201, "Client Info Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateContactInfo(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await ClientService.updateContactInfo(updateOne);
      util.setSuccess(201, "Client Contact Info Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateBillingInfo(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await ClientService.updateBillingInfo(updateOne);
      util.setSuccess(201, "Client Billing Info Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateGoals(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await ClientService.updateGoals(updateOne);
      util.setSuccess(201, "Client Goals Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async noteHist(req, res) {
    try {
      const records = await ClientService.getNoteHist();
      if (records.length > 0) {
        util.setSuccess(200, "Note hist num retrieved", records);
      } else {
        util.setSuccess(200, "No note hist num found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

// export default ClientController;
module.exports = ClientController;
