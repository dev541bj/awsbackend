//import TemplateService from "../services/TemplateService";
var TemplateService = require("../services/TemplateService");
//import Util from "../utils/Utils";
var Util = require("../utils/Utils");

const util = new Util();

class TemplateController {
  static async addNewTemplate(req, res) {
    try {
      const createdAt = new Date();

      await TemplateService.addNew({ ...req.body, createdAt });

      util.setSuccess(200, "Template added.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addSoapTemplate(req, res) {
    try {
      const createdAt = new Date();
      await TemplateService.addSoap(req.body);

      util.setSuccess(200, "Template added.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addRatingTemplate(req, res) {
    try {
      const createdAt = new Date();
      await TemplateService.addRating(req.body);

      util.setSuccess(200, "Template added.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addPercentageTemplate(req, res) {
    try {
      const createdAt = new Date();

      await TemplateService.addPercentage(req.body);

      util.setSuccess(200, "Template added.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addNarrativeTemplate(req, res) {
    try {
      const createdAt = new Date();

      await TemplateService.addNarrative(req.body);

      util.setSuccess(200, "Template added.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  //this is this initial Controller for pulling the Templates table
  static async getAllTemplates(req, res) {
    try {
      const allTemplates = await TemplateService.getAll();
      if (allTemplates.length > 0) {
        util.setSuccess(200, "Templates retrieved", allTemplates);
      } else {
        util.setSuccess(200, "No Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getTemplateById(req, res) {
    try {
      const template = await TemplateService.getById(req.params.id);

      if (template && template.length) {
        util.setSuccess(200, "Template retrieved", template[0]);
      } else {
        util.setSuccess(200, "Not Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getSoapTemplate(req, res) {
    try {
      const template = await TemplateService.getSoap();

      if (template && template.length) {
        util.setSuccess(200, "Template retrieved", template[0]);
      } else {
        util.setSuccess(200, "Not Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getRatingTemplate(req, res) {
    try {
      const template = await TemplateService.getRating();

      if (template && template.length) {
        util.setSuccess(200, "Template retrieved", template[0]);
      } else {
        util.setSuccess(200, "Not Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getPercentageTemplate(req, res) {
    try {
      const template = await TemplateService.getPercentage();

      if (template && template.length) {
        util.setSuccess(200, "Template retrieved", template[0]);
      } else {
        util.setSuccess(200, "Not Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getNarrativeTemplate(req, res) {
    try {
      const template = await TemplateService.getNarrative();

      if (template && template.length) {
        util.setSuccess(200, "Template retrieved", template[0]);
      } else {
        util.setSuccess(200, "Not Templates found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updateTemplateById(req, res) {
    try {
      await TemplateService.updateById(req.body, req.params.id);

      util.setSuccess(200, "Template updated.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async updateNewTemplateById(req, res) {
    try {
      await TemplateService.updateNewById(req.body, req.params.id);

      util.setSuccess(200, "Template updated.");

      return util.send(res);
    } catch (error) {
      util.setError(400, error);
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
      const oneToDelete = await TemplateService.deleteOne(id);

      if (oneToDelete) {
        util.setSuccess(200, "Template deleted");
      } else {
        util.setError(404, `Template with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

//export default TemplateController;
module.exports = TemplateController;
