//import { query } from "./connection";
var query = require("./dbConnection");
//import moment from "moment";
var moment = require("moment");

class EventService {
  static async getAll() {
    var sql = "SELECT * FROM testevent";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async getTemp(req, res) {
    var sql = `SELECT type_note, notes, note_date FROM testevent where id = ${req} `;
    // console.log('request :', sql);

    try {
      return await query(sql, [req]);
    } catch (error) {
      throw error;
    }
  }

  static async getDocument(eventId) {
    var sql = `SELECT client_id, type, notes, note_date, attendance FROM documents where event_id = ${eventId}; `;
    // console.log("request :", sql);

    try {
      return await query(sql, [eventId]);
    } catch (error) {
      throw error;
    }
  }

  // Add calendar event

  static async insertOne(reqBody) {
    // console.log('insert data:', reqBody)
    var formdata = reqBody;
    var newClient = formdata.newClient;
    var newBillType = formdata.newBillType;
    // var newClientType = formdata.newClientType;
    //var newClient = formdata.newClient;
    var newTherapist = formdata.newTherapist;
    var newLocation = formdata.newLocation;
    var newCategory = formdata.newCategory;
    var checkedRepeat = formdata.checkedRepeat; //true,false
    var repeatOption = formdata.repeatOption; //"Daily","Weekly","Monthly","Custom"
    var newEndRepeat = formdata.newEndRepeat; //"After","On Date"
    var newCustomFreq = formdata.newCustomFreq; //"Specifid Days","Every x days","Weekly","Monthly"
    var newRepeatEveryNumDays = formdata.newRepeatEveryNumDays;
    var newRepeatEveryNumWeeks = formdata.newRepeatEveryNumWeeks;
    var newRepeatEveryNumMonths = formdata.newRepeatEveryNumMonths;
    var sun = formdata.sun;
    var mon = formdata.mon;
    var tues = formdata.tues;
    var wed = formdata.wed;
    var thu = formdata.thu;
    var fri = formdata.fri;
    var sat = formdata.sat;
    var transType = formdata.transType;
    var billingEmail = formdata.billingEmail || "";
    var sessionCost = formdata.sessionCost || 0;
    var sessionLength = formdata.sessionLength || 0;
    var selected_days = [sun, mon, tues, wed, thu, fri, sat];
    var start_dates = [];
    var end_dates = [];
    // var clientsEmail = [];
    const clients = formdata.newClients.toString();
    const therapists = formdata.newTherapists.toString();
    const selectedClientID = formdata.selectedClientID.toString();
    const selectedClientEmail = formdata.selectedClientEmail.toString();
    const selectedClientCosts = formdata.selectedClientCosts.toString();
    const selectedTherapistID = formdata.selectedTherapistID.toString();
    const selectedTherapistEmail = formdata.selectedTherapistEmail.toString();

    // console.log('insert Data:', clients, therapists)

    var startID = formdata.startID;
    var notes = formdata.notes;
    var noteType = formdata.noteType;

    //------------------occurances-----------------------------
    var newNumOccurences = formdata.newNumOccurences; //"4"
    var occurances_to_add = 0;
    if (newNumOccurences) occurances_to_add = parseInt(newNumOccurences);
    var occurances_added = 0;
    var interval = 0;
    var interval_unit = "days";
    //---------------------------------------------------------
    //------------------dates----------------------------------
    var selectedDate = formdata.selectedDate; //start date
    var endSelectedDate = formdata.endSelectedDate; //end date
    var first_start_date = moment(selectedDate, "YYYY-MM-DD HH:mm:ss");
    var start_date_to_add = moment(selectedDate, "YYYY-MM-DD HH:mm:ss");
    var end_date_to_add = moment(endSelectedDate, "YYYY-MM-DD HH:mm:ss");

    var date_limit = moment(start_date_to_add).add(1, "seconds");

    if (startID === undefined || startID === null || startID === "") {
      var selectedDateOccurenceEnd = formdata.selectedDateOccurenceEnd; // repeat end date "2019-09-18 03:41:00"
    } else {
      var selectedDateOccurenceEnd = moment(
        formdata.selectedDateOccurenceEnd,
        "YYYY-MM-DD HH:mm:ss"
      ).format("YYYY-MM-DD HH:mm:ss");
    }

    if (selectedDateOccurenceEnd) {
      var date_limit_str =
        selectedDateOccurenceEnd.substring(0, 10) +
        " " +
        selectedDate.substring(11, 19);
      date_limit = moment(date_limit_str, "YYYY-MM-DD HH:mm:ss");
    }

    if (selectedDateOccurenceEnd == "" || selectedDateOccurenceEnd == null)
      selectedDateOccurenceEnd = selectedDate;
    //---------------------------------------------------------

    /*
    
      In the while loop  these two arrays start_dates and end_dates are filled
      and then used the dates in them to make insert queries whether its one appointment
       or multiple appointments that needs to be created
       The while loop runs until the required number of occourances are added or
       the last date comes as given by user to stop the repeat appointments
       The dates are created by adding up days to the first date (provided by user)
       The number of days to be added is decided based on the interval (provided by user)
       or just 1 day is added in each iteration and only the specific days get added
       */
    while (
      (!checkedRepeat && occurances_added < 1) ||
      (checkedRepeat &&
        newEndRepeat === "After" &&
        occurances_added < occurances_to_add) ||
      (checkedRepeat &&
        newEndRepeat === "On Date" &&
        start_date_to_add <= date_limit)
    ) {
      //logs.push("while");
      if (repeatOption === "Daily") interval = 1;
      else if (repeatOption === "Weekly") interval = 7;
      else if (repeatOption === "Monthly") {
        interval = 1;
        interval_unit = "months";
      } else if (repeatOption === "Custom") {
        if (newCustomFreq === "Every x days") interval = newRepeatEveryNumDays;
        else if (newCustomFreq === "Weekly")
          interval = newRepeatEveryNumWeeks * 7;
        else if (newCustomFreq === "Monthly") {
          interval = newRepeatEveryNumMonths;
          interval_unit = "months";
        }
      }

      if (repeatOption === "Custom" && newCustomFreq === "Specific Days") {
        //logs.push("specific days");
        if (
          occurances_added < 1 ||
          (occurances_added > 0 && selected_days[start_date_to_add.day()])
        ) {
          start_dates.push(start_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
          end_dates.push(end_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
          occurances_added++;
        }
        start_date_to_add.add(1, "days");
        end_date_to_add.add(1, "days");
      } else {
        occurances_added++;
        start_dates.push(start_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
        end_dates.push(end_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
        start_date_to_add = start_date_to_add.add(interval, interval_unit);
        end_date_to_add = end_date_to_add.add(interval, interval_unit);

        // for a special case e.g. a user creates an appointment on 31st and sets a monthly repetition
        //using moment library 31st + 1 month -> 30th and then 30th + 1 month -> 30th (even if month has 31 days)
        //so I have checked each repitition's date and adjusted it to set the real date wheneever available
        if (interval_unit === "months") {
          var month_end_diff =
            first_start_date.date() - start_date_to_add.date();
          if (month_end_diff > 0) {
            var new_start_date_to_add = moment(start_date_to_add).add(
              month_end_diff,
              "days"
            );
            var new_end_date_to_add = moment(end_date_to_add).add(
              month_end_diff,
              "days"
            );
            if (start_date_to_add.month() === new_start_date_to_add.month())
              start_date_to_add = new_start_date_to_add;
            end_date_to_add = new_end_date_to_add;
          }
        }
      }
    }

    try {
      let insertFirstSql =
        `INSERT INTO testevent (title, 
        bill_type, 
        client,
        transType,
        therapist, 
        location, 
        category, 
        trans_date,
        start, 
        end, 
        repeats, 
        custom_frequency, 
        repeat_option,
        end_repeat, 
        end_date_occurrence, 
        num_occurences, 
        repeat_num_days, 
        sun, 
        mon, 
        tues, 
        wed, 
        thu, 
        fri, 
        sat, 
        billing_email, 
        session_costs,
        email,
        session_cost, 
        session_set_length, 
        clients, 
        therapists,
        clientsID,
        therapistsID
        ) VALUES` +
        " ('" +
        newClient +
        "','" +
        newBillType +
        "','" +
        newClient +
        "','" +
        transType +
        "','" +
        newTherapist +
        "','" +
        newLocation +
        "','" +
        newCategory +
        "','" +
        selectedDate +
        "','" +
        selectedDate +
        "','" +
        endSelectedDate +
        "','" +
        checkedRepeat +
        "','" +
        newCustomFreq +
        "','" +
        repeatOption +
        "','" +
        newEndRepeat +
        "','" +
        selectedDateOccurenceEnd +
        "','" +
        newNumOccurences +
        "','" +
        newRepeatEveryNumDays +
        "','" +
        sun +
        "','" +
        mon +
        "','" +
        tues +
        "','" +
        wed +
        "','" +
        thu +
        "','" +
        fri +
        "','" +
        sat +
        "', '" +
        selectedClientEmail +
        "', '" +
        selectedClientCosts +
        "', '" +
        selectedTherapistEmail +
        "','" +
        sessionCost +
        "','" +
        sessionLength +
        "','" +
        clients +
        "','" +
        therapists +
        "','" +
        selectedClientID +
        "','" +
        selectedTherapistID +
        "'" +
        ")";
      const firstQueryResult = await query(insertFirstSql);

      if (startID === undefined || startID === null || startID === "") {
        let updateSQL = "UPDATE testevent SET series_start_id=? WHERE id=?";
        query(updateSQL, [
          firstQueryResult.insertId,
          firstQueryResult.insertId,
        ]);
      } else {
        let updateSQL =
          "UPDATE testevent SET series_start_id=?, notes=?, type_note=? WHERE id=?";
        query(updateSQL, [
          startID,
          notes[1].notes,
          noteType[1].type_note,
          firstQueryResult.insertId,
        ]);
      }

      if (start_dates.length == 1)
        // if it has no series of events.
        return firstQueryResult;

      if (startID === undefined || startID === null || startID === "") {
        var sql = `INSERT INTO testevent (title, 
          bill_type, 
          client, 
          transType,
          therapist, 
          location, 
          category, 
          trans_date,
          start, 
          end, 
          repeats, 
          custom_frequency, 
          repeat_option, 
          end_repeat, 
          end_date_occurrence,
          num_occurences,  
          series_start_id, 
          billing_email, 
          session_costs, 
          email, 
          session_cost, 
          session_set_length, 
          clients, 
          therapists, 
          clientsID, 
          therapistsID 
        ) VALUES`;

        for (let i = 1; i < start_dates.length; i++) {
          sql +=
            " ('" +
            newClient +
            "','" +
            newBillType +
            "','" +
            newClient +
            "','" +
            transType +
            "','" +
            newTherapist +
            "','" +
            newLocation +
            "','" +
            newCategory +
            "','" +
            start_dates[i] +
            "','" +
            start_dates[i] +
            "','" +
            end_dates[i] +
            "','" +
            checkedRepeat +
            "','" +
            newCustomFreq +
            "','" +
            repeatOption +
            "','" +
            newEndRepeat +
            "','" +
            selectedDateOccurenceEnd +
            "','" +
            newNumOccurences +
            "'," +
            firstQueryResult.insertId +
            ",'" +
            selectedClientEmail +
            "','" +
            selectedClientCosts +
            "','" +
            selectedTherapistEmail +
            "','" +
            sessionCost +
            "','" +
            sessionLength +
            "','" +
            clients +
            "','" +
            therapists +
            "','" +
            selectedClientID +
            "','" +
            selectedTherapistID +
            "'" +
            ")";
          if (i < start_dates.length - 1) sql += ",";
        }
        return await query(sql);
      } else {
        // console.log('note:', notes)
        for (let j = 0; j < start_dates.length; j++) {
          if (
            reqBody.noteType[j].type_note === null ||
            reqBody.noteType[j].type_note === undefined
          ) {
            noteType[j].type_note = 0;
          }
          if (
            reqBody.notes[j].notes === null ||
            reqBody.notes[j].notes === undefined
          ) {
            notes[j].notes = "";
          }
        }
        var sql = `INSERT INTO testevent (title, 
          bill_type, 
          client, 
          transType,
          therapist, 
          location, 
          category, 
          trans_date,
          start, 
          end, 
          repeats, 
          repeat_option, 
          end_repeat, 
          end_date_occurrence,
          num_occurences,  
          series_start_id, 
          billing_email, 
          session_cost, 
          session_set_length, 
          clients, 
          therapists,
          clientsID,
          therapistsID,
          notes,
          type_note
        ) VALUES`;

        for (let i = 1; i < start_dates.length; i++) {
          sql +=
            " ('" +
            newClient +
            "','" +
            transType +
            "','" +
            newBillType +
            "','" +
            newClient +
            "','" +
            newTherapist +
            "','" +
            newLocation +
            "','" +
            newCategory +
            "','" +
            start_dates[i] +
            "','" +
            start_dates[i] +
            "','" +
            end_dates[i] +
            "','" +
            checkedRepeat +
            "','" +
            repeatOption +
            "','" +
            newEndRepeat +
            "','" +
            selectedDateOccurenceEnd +
            "','" +
            newNumOccurences +
            "'," +
            startID +
            ", '" +
            billingEmail +
            "', " +
            sessionCost +
            ", " +
            sessionLength +
            ",'" +
            clients +
            "','" +
            therapists +
            "','" +
            selectedClientID +
            "','" +
            selectedTherapistID +
            "','" +
            notes[i].notes +
            "','" +
            noteType[i].type_note +
            "'" +
            ")";
          if (i < start_dates.length - 1) sql += ",";
        }
        return await query(sql);
      }

      // var sql = `INSERT INTO testevent (title,
      //     bill_type,
      //     client,
      //     therapist,
      //     location,
      //     category,
      //     start,
      //     end,
      //     repeats,
      //     repeat_option,
      //     end_repeat,
      //     num_occurences,
      //     series_start_id,
      //     billing_email,
      //     session_cost,
      //     session_set_length,
      //     clients,
      //     therapists,
      //     clientsID,
      //     therapistsID
      //   ) VALUES`;

      // for (let i = 1; i < start_dates.length; i++) {
      //   sql +=
      //     " ('" +
      //     newClient +
      //     "','" +
      //     newBillType +
      //     "','" +
      //     newClient +
      //     "','" +
      //     newTherapist +
      //     "','" +
      //     newLocation +
      //     "','" +
      //     newCategory +
      //     "','" +
      //     start_dates[i] +
      //     "','" +
      //     end_dates[i] +
      //     "','" +
      //     checkedRepeat +
      //     "','" +
      //     repeatOption +
      //     "','" +
      //     newEndRepeat +
      //     "','" +
      //     newNumOccurences +
      //     "'," +
      //     firstQueryResult.insertId +
      //     ", '" +
      //     billingEmail +
      //     "', " +
      //     sessionCost +
      //     ", " +
      //     sessionLength +
      //     ",'" +
      //     clients +
      //     "','" +
      //     therapists +
      //     "','" +
      //     selectedClientID +
      //     "','" +
      //     selectedTherapistID +
      //     "'" +
      //     ")";
      //   if (i < start_dates.length - 1) sql += ",";
      // }
      // return await query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // dete sole calendar event
  static async deleteOne(id) {
    const sql = `DELETE FROM testevent WHERE id = ${id}`;

    try {
      return await query(sql);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async deleteDocumentsOf(id) {
    const sql = `DELETE FROM documents WHERE event_id = ${id}`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  // delete recurring series of calendar events
  static async deleteSeries(id) {
    const sql = `DELETE FROM testevent WHERE series_start_id = ${id}`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  // update sole event
  static async updateSole(updatedOne) {
    const {
      eventId,
      existingBillType,
      existingLocation,
      existingCategory,
      existingStart,
      existingEnd,
      billingEmail,
      sessionCost,
      sessionLength,
      existingClients,
      existingTherapists,
      transType,
      transDate,
    } = updatedOne;

    var clients = "";
    var therapists = "";

    for (let i = 0; i < updatedOne.existingClients.length; i++) {
      if (i == 0) {
        clients += updatedOne.existingClients[0];
      } else {
        clients += "," + updatedOne.existingClients[i];
      }
    }

    for (let i = 0; i < updatedOne.existingTherapists.length; i++) {
      if (i == 0) {
        therapists += updatedOne.existingTherapists[0];
      } else {
        therapists += "," + updatedOne.existingTherapists[i];
      }
    }

    const sql = `UPDATE testevent SET bill_type = ?, location = ?, category = ?, start = ?, end = ?, billing_email = ?, session_cost = ?, session_set_length = ?, clients = ?, therapists = ?, transType = ?, trans_date = ? WHERE id = ?`;
    try {
      return await query(sql, [
        existingBillType,
        existingLocation,
        existingCategory,
        existingStart,
        existingEnd,
        billingEmail,
        sessionCost,
        sessionLength,
        clients,
        therapists,
        transType,
        transDate,
        eventId,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async updateSeri(reqBody) {
    var eventId = reqBody.eventId;
    var seriesStartId = parseInt(reqBody.seriesStartId);
    var existingBillType = reqBody.existingBillType;
    var existingClient = reqBody.existingClient;
    var existingTherapist = reqBody.existingTherapist;
    var existingLocation = reqBody.existingLocation;
    var existingCategory = reqBody.existingCategory;
    var existingStart = reqBody.existingStart;
    var existingEnd = reqBody.existingEnd;
    var transDate = reqBody.transDate;
    var existingRepeatOption = reqBody.existingRepeatOption;
    var existingEveryNumDays = reqBody.existingEveryNumDays;
    var existingEveryNumWeeks = reqBody.existingEveryNumWeeks;
    var existingEveryNumMonths = reqBody.existingEveryNumMonths;
    var existingCheckedRepeat = reqBody.existingCheckedRepeat;
    var existingEndRepeat = reqBody.existingEndRepeat;
    var existingCustomFreq = reqBody.existingCustomFreq;
    var existingNumOccurences = parseInt(reqBody.existingNumOccurences);
    var existingEndDateOccurrence = reqBody.existingEndDateOccurrence;
    var sun = reqBody.sun;
    var mon = reqBody.mon;
    var tues = reqBody.tues;
    var wed = reqBody.wed;
    var thu = reqBody.thu;
    var fri = reqBody.fri;
    var sat = reqBody.sat;
    var selected_days = [sun, mon, tues, wed, thu, fri, sat];
    var billingEmail = reqBody.billingEmail;
    var sessionCost = reqBody.sessionCost;
    var sessionLength = reqBody.sessionLength;
    var existingClients = reqBody.existingClients.toString();
    var existingTherapists = reqBody.existingTherapists.toString();
    var eClientID = reqBody.eClientID.toString();
    var eClientEmail = reqBody.eClientEmail.toString();
    var eClientCosts = reqBody.eClientCosts.toString();
    var eTherapistID = reqBody.eTherapistID.toString();
    var eTherapistEmail = reqBody.eTherapistEmail.toString();
    var transType = reqBody.transType;

    var start_dates = [];
    var end_dates = [];

    //------------------occurances-----------------------------
    var newNumOccurences = existingNumOccurences; //"4"
    var occurances_to_add = 0;
    if (newNumOccurences) occurances_to_add = parseInt(newNumOccurences);
    var occurances_added = 0;
    var interval = 0;
    var interval_unit = "days";

    //------------------dates----------------------------------
    var selectedDate = existingStart; //start date
    var endSelectedDate = existingEnd; //end date
    var first_start_date = moment(selectedDate, "YYYY-MM-DD HH:mm:ss");
    var start_date_to_add = moment(selectedDate, "YYYY-MM-DD HH:mm:ss");
    var end_date_to_add = moment(endSelectedDate, "YYYY-MM-DD HH:mm:ss");

    var date_limit = moment(start_date_to_add).add(1, "seconds");
    var selectedDateOccurenceEnd = existingEndDateOccurrence;

    if (selectedDateOccurenceEnd) {
      var date_limit_str =
        selectedDateOccurenceEnd.substring(0, 10) +
        " " +
        selectedDate.substring(11, 19);
      date_limit = moment(date_limit_str, "YYYY-MM-DD HH:mm:ss");
    }

    if (selectedDateOccurenceEnd == "" || selectedDateOccurenceEnd == null)
      selectedDateOccurenceEnd = selectedDate;
    //---------------------------------------------------------
    // console.log('date:', selectedDateOccurenceEnd)
    /*
    
      In the while loop  these two arrays start_dates and end_dates are filled
      and then used the dates in them to make insert queries whether its one appointment
       or multiple appointments that needs to be created
       The while loop runs until the required number of occourances are added or
       the last date comes as given by user to stop the repeat appointments
       The dates are created by adding up days to the first date (provided by user)
       The number of days to be added is decided based on the interval (provided by user)
       or just 1 day is added in each iteration and only the specific days get added
       */
    while (
      (!existingCheckedRepeat && occurances_added < 1) ||
      (existingCheckedRepeat &&
        existingEndRepeat === "After" &&
        occurances_added < occurances_to_add) ||
      (existingCheckedRepeat &&
        existingEndRepeat === "On Date" &&
        start_date_to_add <= date_limit)
    ) {
      //logs.push("while");
      if (existingRepeatOption === "Daily") interval = 1;
      else if (existingRepeatOption === "Weekly") interval = 7;
      else if (existingRepeatOption === "Monthly") {
        interval = 1;
        interval_unit = "months";
      } else if (existingRepeatOption === "Custom") {
        if (existingCustomFreq === "Every x days")
          interval = existingEveryNumDays;
        else if (existingCustomFreq === "Weekly")
          interval = existingEveryNumWeeks * 7;
        else if (existingCustomFreq === "Monthly") {
          interval = existingEveryNumMonths;
          interval_unit = "months";
        }
      }

      if (
        existingRepeatOption === "Custom" &&
        existingCustomFreq === "Specific Days"
      ) {
        //logs.push("specific days");
        if (
          occurances_added < 1 ||
          (occurances_added > 0 && selected_days[start_date_to_add.day()])
        ) {
          start_dates.push(start_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
          end_dates.push(end_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
          occurances_added++;
        }
        start_date_to_add.add(1, "days");
        end_date_to_add.add(1, "days");
      } else {
        occurances_added++;
        start_dates.push(start_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
        end_dates.push(end_date_to_add.format("YYYY-MM-DD HH:mm:ss"));
        start_date_to_add = start_date_to_add.add(interval, interval_unit);
        end_date_to_add = end_date_to_add.add(interval, interval_unit);

        // for a special case e.g. a user creates an appointment on 31st and sets a monthly repetition
        //using moment library 31st + 1 month -> 30th and then 30th + 1 month -> 30th (even if month has 31 days)
        //so I have checked each repitition's date and adjusted it to set the real date wheneever available
        if (interval_unit === "months") {
          var month_end_diff =
            first_start_date.date() - start_date_to_add.date();
          if (month_end_diff > 0) {
            var new_start_date_to_add = moment(start_date_to_add).add(
              month_end_diff,
              "days"
            );
            var new_end_date_to_add = moment(end_date_to_add).add(
              month_end_diff,
              "days"
            );
            if (start_date_to_add.month() === new_start_date_to_add.month())
              start_date_to_add = new_start_date_to_add;
            end_date_to_add = new_end_date_to_add;
          }
        }
      }
    }

    // console.log('date:', start_dates, end_dates)
    var sDate;
    var eDate;
    var temp;

    var tempDate = new Date();
    var date = moment(tempDate, "YYYY-MM-DD HH:mm:ss").format(
      "YYYY-MM-DD HH:mm:ss"
    );

    for (let i = 0; i < start_dates.length; i++) {
      if (date < start_dates[i]) {
        if (date.split(" ")[0] === start_dates[i].split(" ")[0]) {
          sDate = start_dates[i + 1];
          eDate = end_dates[i + 1];
        } else {
          sDate = start_dates[i];
          eDate = end_dates[i];
        }
        break;
      }
    }

    const sql1 = `SELECT * FROM testevent WHERE series_start_id = ${seriesStartId}`;

    const existingData = await query(sql1);

    try {
      for (let i = 0; i < existingData.length; i++) {
        const startDate = moment(
          existingData[i].start,
          "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DD HH:mm:ss");
        if (date <= startDate) {
          const sql_del = `DELETE FROM testevent WHERE id = ${
            seriesStartId + i
          }`;
          const ee = await query(sql_del);
        }
      }

      for (let i = 0; i < existingData.length; i++) {
        const startDate = moment(
          existingData[i].start,
          "YYYY-MM-DD HH:mm:ss"
        ).format("YYYY-MM-DD HH:mm:ss");
        if (date < startDate) {
          var updateData = {
            newClient: reqBody.existingClient,
            newBillType: reqBody.existingBillType,
            newTherapist: reqBody.existingTherapist,
            newLocation: reqBody.existingLocation,
            newCategory: reqBody.existingCategory,
            checkedRepeat: reqBody.existingCheckedRepeat ? 1 : 0, //true,false
            repeatOption: reqBody.existingRepeatOption, //"Daily","Weekly","Monthly","Custom"
            newEndRepeat: reqBody.existingEndRepeat, //"After","On Date"
            newCustomFreq: reqBody.existingCustomFreq, //"Specifid Days","Every x days","Weekly","Monthly"
            newNumOccurences: reqBody.existingNumOccurences, //"4"
            newRepeatEveryNumDays: reqBody.existingEveryNumDays,
            newRepeatEveryNumWeeks: reqBody.existingEveryNumWeeks,
            newRepeatEveryNumMonths: reqBody.existingEveryNumMonths,
            sun: reqBody.sun ? 1 : 0,
            mon: reqBody.mon ? 1 : 0,
            tues: reqBody.tues ? 1 : 0,
            wed: reqBody.wed ? 1 : 0,
            thu: reqBody.thu ? 1 : 0,
            fri: reqBody.fri ? 1 : 0,
            sat: reqBody.sat ? 1 : 0,
            billingEmail: reqBody.billingEmail || "",
            sessionCost: reqBody.sessionCost || 0,
            sessionLength: reqBody.sessionLength || 0,
            selected_days: [sun, mon, tues, wed, thu, fri, sat],
            start_dates: [],
            end_dates: [],
            newClients: reqBody.existingClients,
            newTherapists: reqBody.existingTherapists,
            selectedClientID: reqBody.eClientID,
            selectedClientEmail: reqBody.eClientEmail,
            selectedClientCosts: reqBody.eClientCosts,
            selectedTherapistID: reqBody.eTherapistID,
            selectedTherapistEmail: reqBody.eTherapistEmail,
            selectedDate: sDate, //start date
            endSelectedDate: eDate, //end date
            startID: seriesStartId,
            notes: existingData,
            noteType: existingData,
            selectedDateOccurenceEnd: selectedDateOccurenceEnd,
          };
          this.insertOne(updateData);
          break;
        }
      }

      // for(let i = 0; i < parseInt(reqBody.existingNumOccurences); i++){

      // }

      // if (existingNumOccurences < existingData[0].num_occurences) {
      //   try {
      //     const sql = `UPDATE testevent SET bill_type = ?, location = ?, category = ?, start = ?, end = ?, billing_email = ?,email = ?, session_cost = ?, session_set_length = ?, clients = ?, therapists = ?, clientsID = ?, therapistsID = ?, transType = ?, trans_date = ?, repeat_option = ?,end_repeat=?, num_occurences=? WHERE id = ?`;
      //     for (let i = 0; i < existingNumOccurences; i++) {
      //       console.log('update id :', seriesStartId + i)
      //       const dd = await query(sql, [existingBillType, existingLocation, existingCategory, start_dates[i], end_dates[i], eClientEmail, eTherapistEmail, sessionCost, sessionLength, existingClients, existingTherapists, eClientID, eTherapistID, transType, transDate, existingRepeatOption, existingEndRepeat, existingNumOccurences, seriesStartId + i]);
      //     }
      //     for (let j = existingNumOccurences; j < existingData[0].num_occurences; j++) {
      //       const sql_del = `DELETE FROM testevent WHERE id = ${seriesStartId + j}`;
      //       const ee = await query(sql_del);
      //     }
      //   } catch (error) {
      //     console.log("exception: ", error);
      //     throw error;
      //   }
      // }
    } catch (err) {
      console.log("exception: ", err);
    }

    // const sql = `UPDATE testevent SET bill_type = ?, location = ?, category = ?, start = ?, end = ?, billing_email = ?,email = ?, session_cost = ?, session_set_length = ?, clients = ?, therapists = ?, clientsID = ?, therapistsID = ?, transType = ?, trans_date = ?, repeat_option = ?,end_repeat=? WHERE id = ?`;
    // try {
    //   for (let i = 0; i < existingNumOccurences; i++) {
    //     const dd = await query(sql, [existingBillType, existingLocation, existingCategory, start_dates[i], end_dates[i], eClientEmail, eTherapistEmail, sessionCost, sessionLength, existingClients, existingTherapists, eClientID, eTherapistID, transType, transDate, existingRepeatOption, existingEndRepeat, eventId + i]);
    //   }
    // } catch (error) {
    //   console.log("exception: ", error);
    //   throw error;
    // }
  }

  // add documentation to event
  static async addDocNote(newOne) {
    const sql = `UPDATE testevent 
    SET attendance = ?,  
    notes = ?,
    note_date = ?  
    WHERE id = ?`;
    const { attendanceType, narrativeNote, noteDate, calID } = newOne;
    try {
      return await query(sql, [attendanceType, narrativeNote, noteDate, calID]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async note_template(newOne) {
    const sql = `UPDATE testevent 
    SET 
    type_note = ?,
    notes = ?,
    note_date = ?
    WHERE id = ?`;
    const { id, type, sections, note_date } = newOne;
    try {
      return await query(sql, [type, sections, note_date, id]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async note_document(newOne) {
    const {
      id,
      type,
      sections,
      note_date,
      session_date,
      clientID,
      attendance,
      email,
    } = newOne;
    var sql = `SELECT COUNT(*) as cnt FROM documents WHERE event_id = ? and client_id = ?;`;
    var res = await query(sql, [id, clientID]);
    // if (res.status !== 'success') {
    //   return res;
    // }

    if (res && res[0].cnt > 0) {
      sql = `UPDATE documents 
      SET  
      attendance = ?,
      type = ?,
      notes = ?,
      note_date = ?,
      session_date = ?
      WHERE event_id = ? and client_id = ?`;
    } else {
      sql = `INSERT documents 
      SET  
      attendance = ?,
      type = ?,
      notes = ?,
      note_date = ?,
      session_date = ?,
      event_id = ?,
      client_id = ?;`;
    }

    try {
      return await query(sql, [
        attendance,
        type,
        sections,
        note_date,
        session_date,
        id,
        clientID,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      return { res, error };
    }
  }

  // KPI for sessions left in the week
  static async getSessionsLeftInWeek() {
    var sql = `SELECT COUNT(id) as now_and_rest_of_week FROM testevent WHERE (start BETWEEN current_timestamp() 
    AND (curdate() + INTERVAL 6 - weekday(curdate()) DAY)) 
    AND therapist = 'Harry Potter'`;
    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  // KPI for total sessions in the week
  static async totalSessionsInWeek() {
    var sql = `SELECT count(id) AS total_sessions_in_week FROM testevent WHERE (start between (curdate()
     + INTERVAL 0 - weekday(curdate()) DAY) 
    AND (curdate() + INTERVAL 6 - weekday(curdate()) DAY))`;
    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  // home calendar showing the events for the current day
  static async curDayCal() {
    var sql = `SELECT id, date_format(start, '%l:%i %p') AS start, date_format(end, '%l:%i %p') AS end, 
    clients  FROM testevent WHERE DATE(start) = curdate() `;
    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }
}

//export default EventService;
module.exports = EventService;
