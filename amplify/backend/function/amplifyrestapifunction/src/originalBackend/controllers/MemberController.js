// import MemberService from "../services/MemberService";
var MemberService = require("../services/MemberService");
//import Util from "../utils/Utils";
var Util = require("../utils/Utils");

const util = new Util();

class MemberController {
  static async getAllMembers(req, res) {
    try {
      const allMembers = await MemberService.getAllMembers();
      if (allMembers.length > 0) {
        util.setSuccess(200, "Members retrieved", allMembers);
      } else {
        util.setSuccess(200, "No member found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getActiveMembers(req, res) {
    try {
      const activeMembers = await MemberService.getActiveMembers();
      if (activeMembers.length > 0) {
        util.setSuccess(200, "Members retrieved", activeMembers);
      } else {
        util.setSuccess(200, "No member found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getActiveTherapistsDropDown(req, res) {
    try {
      const therapists = await MemberService.getActiveTherapistsDropDown();
      if (therapists.length > 0) {
        util.setSuccess(200, "Active therapists retrieved", therapists);
      } else {
        util.setSuccess(200, "No active therapist found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getSelectedClient(req, res) {
    try {
      const selected = await MemberService.getSelected(req.params.id);
      if (selected) {
        util.setSuccess(200, "Active selected retrieved", selected);
      } else {
        util.setSuccess(200, "No active selected found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addMember(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await MemberService.addOne(newOne);
      util.setSuccess(201, "Member Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateMemberInfo(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await MemberService.updateInfo(updateOne);
      util.setSuccess(201, "Member Info Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateMemberPriv(req, res) {
    const updateOne = req.body;
    try {
      const updatedOne = await MemberService.updatePriv(updateOne);
      util.setSuccess(201, "Member Privliges Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async assiCli(req, res) {
    const updateOne = req.body;

    try {
      const updatedOne = await MemberService.assignClient(updateOne);
      util.setSuccess(201, "Member Privliges Updated!", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async catReport(req, res) {
    const updateOne = req.query;

    try {
      const updatedOne = await MemberService.categoryReport(updateOne);
      util.setSuccess(201, "Report calculated", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async billReport(req, res) {
    const updateOne = req.query;

    try {
      const updatedOne = await MemberService.billableHours(updateOne);
      util.setSuccess(201, "Report calculated", updatedOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async addReport(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await MemberService.newReport(newOne);
      util.setSuccess(201, "Report Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async getReports(req, res) {
    try {
      const allReports = await MemberService.getReports();
      if (allReports.length > 0) {
        util.setSuccess(200, "Reports retrieved", allReports);
      } else {
        util.setSuccess(200, "No report found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getReportById(req, res) {
    try {
      const report = await MemberService.getById(req.params.id);

      if (report && report.length) {
        util.setSuccess(200, "Report retrieved", report[0]);
      } else {
        util.setSuccess(200, "No Reports found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

//export default MemberController;
module.exports = MemberController;
