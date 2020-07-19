//import EventService from "../services/EventService";
var EventService = require("../services/EventService");
//import Util from "../utils/Utils";
var Util = require("../utils/Utils");

const util = new Util();

class EventController {
  static async getAll(req, res) {
    try {
      const allEvents = await EventService.getAll();
      const allEvents2 = await EventController.injectAttendance(allEvents);

      if (allEvents2.length > 0) {
        util.setSuccess(200, "Events retrieved", allEvents2);
      } else {
        util.setSuccess(200, "No Event found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async injectAttendance(events) {
    try {
      for (let event of events) {
        let documents = await EventController.getDocumentsLocal(event.id);
        let attendances = documents.map((item) => {
          return item.attendance;
        });
        event.attendance = attendances;
      }
      return events;
    } catch (error) {
      console.log(error);
    }
  }

  static async getTemplate(req, res) {
    // console.log('here ->', req.params.id);
    const id = req.params.id;
    try {
      const allEvents = await EventService.getTemp(id);
      if (allEvents.length > 0) {
        util.setSuccess(200, "Events retrieved", allEvents);
      } else {
        util.setSuccess(200, "No Event found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getDocument(req, res) {
    const id = req.params.id;
    try {
      const allEvents = await EventService.getDocument(id);
      if (allEvents.length > 0) {
        util.setSuccess(200, "Event Docs retrieved", allEvents);
      } else {
        util.setSuccess(200, "No Event Doc found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async getDocumentsLocal(id) {
    try {
      const allDocuments = await EventService.getDocument(id);
      if (allDocuments.length > 0) {
        return allDocuments;
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  static async insert(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.insertOne(newOne);
      util.setSuccess(201, "Event Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateSole(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.updateSole(newOne);
      util.setSuccess(201, "Event Updated!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async updateSeries(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.updateSeri(newOne);
      util.setSuccess(201, "Event Updated!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async note(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.note_template(newOne);
      util.setSuccess(201, "Event Updated!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async saveDoc(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.note_document(newOne);
      util.setSuccess(201, "Event Note Updated!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async saveDocs(req, res) {
    try {
      const documents = req.body.documents;
      const results = [];
      for (var idx = 0; idx < documents.length; idx++) {
        const result = await EventService.note_document(documents[idx]);
        results[idx] = result;
      }

      util.setSuccess(201, "Event Note Updated!", results);
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
      //Delete the documents associated with 'id'
      await EventService.deleteDocumentsOf(id);
    } catch (error) {}

    try {
      const oneToDelete = await EventService.deleteOne(id);

      if (oneToDelete) {
        util.setSuccess(200, "Event deleted");
      } else {
        util.setError(404, `Event with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async deleteSeries(req, res) {
    const { id } = req.params;
    if (!Number(id)) {
      util.setError(400, "Please provide a numeric value");
      return util.send(res);
    }

    try {
      const onesToDelete = await EventService.deleteSeries(id);

      if (onesToDelete) {
        util.setSuccess(200, "Event deleted");
      } else {
        util.setError(404, `Event with the id ${id} cannot be found`);
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async addNote(req, res) {
    const newOne = req.body;
    try {
      const createdOne = await EventService.addDocNote(newOne);
      util.setSuccess(201, "Documentation Added!", createdOne);
      return util.send(res);
    } catch (error) {
      util.setError(400, error.message);
      return util.send(res);
    }
  }

  static async getSessionsLeftInWeek(req, res) {
    try {
      const sessionsLeftInWeek = await EventService.getSessionsLeftInWeek();
      if (sessionsLeftInWeek.length > 0) {
        util.setSuccess(200, "Number retrieved", sessionsLeftInWeek);
      } else {
        util.setSuccess(200, "No Numbers found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async totalSessionsInWeek(req, res) {
    try {
      const sessionsInWeek = await EventService.totalSessionsInWeek();
      if (sessionsInWeek.length > 0) {
        util.setSuccess(200, "Number retrieved", sessionsInWeek);
      } else {
        util.setSuccess(200, "No Numbers found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async curDayCal(req, res) {
    try {
      const curCal = await EventService.curDayCal();
      if (curCal.length > 0) {
        util.setSuccess(200, "Data retrieved", curCal);
      } else {
        util.setSuccess(200, "No data found");
      }
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

//export default EventController;
module.exports = EventController;
