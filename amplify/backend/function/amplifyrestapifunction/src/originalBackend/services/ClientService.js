// import { query } from "./connection";
var query = require("./dbConnection");

class ClientService {
  static async getAllClients() {
    const sql =
      "SELECT *, concat(substring(client_first_name, 1, 1), substring(client_last_name, 1, 1)) initials FROM clients";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async getActiveClients() {
    const sql = `SELECT *, concat(substring(client_first_name, 1, 1), substring(client_last_name, 1, 1)) initials 
      FROM clients 
      WHERE active = 1`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async addOne(newOne) {
    const sql =
      "INSERT INTO clients (active, title, client_first_name, client_last_name, client_full_name, client_type,phone, street_address, email, assi_therapist_full_name,facility,session_type, session_cost,session_length, bday, notes,city,state, zip,contact_title, contact_first_name, contact_last_name, contact_street_address, contact_city, contact_state, contact_zip, contact_email, contact_phone, contact_secondary_phone,  billing_first_name, billing_last_name, billing_full_name, payment_type, card_type, card_num, card_exp_date, cvv, billing_street_address, name_on_card, billing_city, billing_state, billing_email, billing_phone, billing_zip, contact2_active, contact_title_2, contact_first_name_2, contact_last_name_2, contact_street_address_2, contact_city_2, contact_state_2, contact_zip_2, contact_email_2, contact_phone_2, contact_secondary_phone_2, contact3_active, contact_title_3, contact_first_name_3, contact_last_name_3, contact_street_address_3, contact_city_3, contact_state_3, contact_zip_3, contact_email_3, contact_phone_3, contact_secondary_phone_3,contact1_receive_email, contact2_receive_email, contact3_receive_email) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const {
      // CONTACT
      checkedActive,
      clientTitle,
      clientFirstName,
      clientLastName,
      clientFullName,
      clientType,
      clientPhone,
      clientAddress,
      clientEmail,
      therapist,
      clientFacility,
      sessionType,
      sessionCost,
      sessionLength,
      clientBday,
      clientNotes,
      clientCity,
      clientState,
      clientZipCode,
      // CONTACT
      contactTitle,
      contactFirstName,
      contactLastName,
      contactAddress,
      contactCity,
      contactState,

      contactZip,
      contactEmail,
      contactPhone,
      contact2ndPhone,
      // billing
      billingFirstName,
      billingLastName,
      billingFullName,
      paymentType,
      cardType,
      cardNum,
      expDate,
      cvv,
      billingAddress,
      nameOnCard,
      billingCity,
      billingState,
      payorEmail,
      billingPhone,
      billingZip,

      // contact 2
      checkedContact2,
      contactTitle2,
      contactFirstName2,
      contactLastName2,
      contactAddress2,
      contactCity2,
      contactState2,
      contactZip2,
      contactEmail2,
      contactPhone2,
      contact2ndPhone2,
      // contact 3

      checkedContact3,
      contactTitle3,
      contactFirstName3,
      contactLastName3,
      contactAddress3,
      contactCity3,
      contactState3,
      contactZip3,
      contactEmail3,
      contactPhone3,
      contact2ndPhone3,
      // receieve email

      contactRecEmail,
      contact2RecEmail,
      contact3RecEmail,
    } = newOne;
    try {
      return await query(sql, [
        // client
        checkedActive,
        clientTitle,
        clientFirstName,
        clientLastName,
        clientFullName,
        clientType,
        clientPhone,
        clientAddress,
        clientEmail,
        therapist,
        clientFacility,
        sessionType,
        sessionCost,
        sessionLength,
        clientBday,
        clientNotes,
        clientCity,
        clientState,
        clientZipCode,

        // contact
        contactTitle,
        contactFirstName,
        contactLastName,
        contactAddress,
        contactCity,
        contactState,

        contactZip,
        contactEmail,
        contactPhone,
        contact2ndPhone,
        // billing
        billingFirstName,
        billingLastName,
        billingFullName,
        paymentType,
        cardType,
        cardNum,
        expDate,
        cvv,
        billingAddress,
        nameOnCard,
        billingCity,
        billingState,
        payorEmail,
        billingPhone,
        billingZip,
        // contact 2
        checkedContact2,
        contactTitle2,
        contactFirstName2,
        contactLastName2,
        contactAddress2,
        contactCity2,
        contactState2,
        contactZip2,
        contactEmail2,
        contactPhone2,
        contact2ndPhone2,
        // contact 3

        checkedContact3,
        contactTitle3,
        contactFirstName3,
        contactLastName3,
        contactAddress3,
        contactCity3,
        contactState3,
        contactZip3,
        contactEmail3,
        contactPhone3,
        contact2ndPhone3,

        // receieve email
        contactRecEmail,
        contact2RecEmail,
        contact3RecEmail,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async getAllPayors() {
    let sql = "SELECT distinct billing_full_name FROM clients";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async getAllFacilities() {
    let sql = "SELECT DISTINCT facility FROM clients WHERE facility != 'null'";

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  static async deleteOne(id) {
    const sql = `DELETE FROM clients WHERE id = ${id}`;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }

  // KPI for total clients
  static async totalClients() {
    var sql = `SELECT count(id) as num_clients from clients where assi_therapist_full_name = 'Harry Potter'`;
    try {
      return await query(sql);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  // update information
  static async updateInfo(updatedOne) {
    const {
      id,
      clientType,
      checkedA,
      clientFirstName,
      clientFacility,
      clientLastName,
      clientFullName,
      clientEmail,
      clientTitle,
      clientTherapist,
      sessionLength,
      sessionCost,
      sessionType,
      clientPhone,
      clientStreetAddress,
      clientBday,
      clientCity,
      clientZipCode,
      clientState,
      clientNotes,
    } = updatedOne;
    const sql = `UPDATE clients
    SET active = ?,
    title = ?,
    client_full_name = ?,
    client_first_name = ?,
    client_last_name= ?,
    client_type = ?,
    phone = ?,
    street_address = ?,
    email = ?,
    city = ?,
    state = ?,
    zip =?,
    notes = ?,
    facility = ?,
    assi_therapist_full_name = ?,
    session_type = ?,
    session_cost = ?,
    session_length = ?,
    bday = ?
    WHERE id = ?`;
    try {
      return await query(sql, [
        checkedA,
        clientTitle,
        clientFullName,
        clientFirstName,
        clientLastName,
        clientType,
        clientPhone,
        clientStreetAddress,
        clientEmail,
        clientCity,
        clientState,
        clientZipCode,
        clientNotes,
        clientFacility,
        clientTherapist,
        sessionType,
        sessionCost,
        sessionLength,
        clientBday,
        id,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  // update contact info
  static async updateContactInfo(updatedOne) {
    const {
      id,
      // contact 1
      contactFirstName,
      contactLastName,
      contactEmail,
      contactAddress,
      contactTitle,
      contact2ndPhone,
      contactPhone,
      contactCity,
      contactState,
      contactZip,
      contactCheckedRecEmails,
      // contact 2
      checkedContact2,
      contact2FirstName,
      contact2LastName,
      contact2Email,
      contact2Address,
      contact2Title,
      contact2Phone,
      contact2City,
      contact2State,
      contact2Zip,
      contact2PhoneSec,
      contact2CheckedRecEmails,
    } = updatedOne;
    const sql = `UPDATE clients
    SET contact_title = ?,
    contact_first_name = ?,
    contact_last_name = ?,
    contact_street_address = ?,
    contact_city = ?,
    contact_state = ?,
    contact_zip = ?,
    contact_email = ?,
    contact_phone = ?,
    contact_sec_phone = ?,
    contact_rec_email = ?,
    contact2_active = ?,
    contact2_first_name = ?,
    contact2_last_name = ?,
    contact2_email = ?,
    contact2_street_address = ?,
    contact2_title = ?,
    contact2_phone = ?,
    contact2_city = ?,
    contact2_state = ?,
    contact2_zip = ?,
    contact2_sec_phone = ?,
    contact2_rec_email = ?,
    WHERE id = ?`;
    try {
      return await query(sql, [
        // contact 1
        contactTitle,
        contactFirstName,
        contactLastName,
        contactAddress,
        contactCity,
        contactState,
        contactZip,
        contactEmail,
        contactPhone,
        contact2ndPhone,
        contactCheckedRecEmails,
        // contact 2
        checkedContact2,
        contact2FirstName,
        contact2LastName,
        contact2Email,
        contact2Address,
        contact2Title,
        contact2Phone,
        contact2City,
        contact2State,
        contact2Zip,
        contact2PhoneSec,
        contact2CheckedRecEmails,
        id,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async updateBillingInfo(updatedOne) {
    const {
      id,
      billSameAsContact,
      billingFirstName,
      billingLastName,
      payorEmail,
      paymentType,
      billingPhone,
      billingAddress,
      billingCity,
      billingZip,
      billingState,
      billingCardType,
      billingNameOnCard,
      billingCardNum,
      billingCVV,
      billingExp,
    } = updatedOne;
    const sql = `UPDATE clients
    SET bill_same_as_contact = ?,
    billing_first_name = ?,
    billing_last_name = ?,
    billing_email = ?,
    payment_type = ?,
    billing_phone = ?,
    billing_street_address = ?,
    billing_city = ?,
    billing_zip = ?,
    billing_state = ?,
    card_type = ?,
    name_on_card = ?,
    card_num = ?,
    cvv = ?,
    card_exp_date = ?
    WHERE id = ?`;
    try {
      return await query(sql, [
        billSameAsContact,
        billingFirstName,
        billingLastName,
        payorEmail,
        paymentType,
        billingPhone,
        billingAddress,
        billingCity,
        billingZip,
        billingState,
        billingCardType,
        billingNameOnCard,
        billingCardNum,
        billingCVV,
        billingExp,
        id,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async updateGoals(updatedOne) {
    const {
      id,
      // goal 1
      addgoal1,
      activeGoal1,
      goal1,
      obj1_1,
      obj1_2,
      obj1_3,
      // goal 2
      addgoal2,
      activeGoal2,
      goal2,
      obj2_1,
      obj2_2,
      obj2_3,
      // goal 3
      addgoal3,
      activeGoal3,
      goal3,
      obj3_1,
      obj3_2,
      obj3_3,
      // goal 4
      addgoal4,
      activeGoal4,
      goal4,
      obj4_1,
      obj4_2,
      obj4_3,
      // goal 5
      addgoal5,
      activeGoal5,
      goal5,
      obj5_1,
      obj5_2,
      obj5_3,
      // goal 6
      addgoal6,
      activeGoal6,
      goal6,
      obj6_1,
      obj6_2,
      obj6_3,
      // goal 7
      addgoal7,
      activeGoal7,
      goal7,
      obj7_1,
      obj7_2,
      obj7_3,
      // goal 8
      addgoal8,
      activeGoal8,
      goal8,
      obj8_1,
      obj8_2,
      obj8_3,
      // goal 9
      addgoal9,
      activeGoal9,
      goal9,
      obj9_1,
      obj9_2,
      obj9_3,
      // goal 10
      addgoal10,
      activeGoal10,
      goal10,
      obj10_1,
      obj10_2,
      obj10_3,
    } = updatedOne;
    const sql = `UPDATE clients
    SET addgoal1 = ?,
    goal1_active = ?,
    goal1_desc = ?,
    obj1_1_desc = ?,
    obj1_2_desc = ?,
    obj1_3_desc = ?,
    addgoal2 = ?,
    goal2_active = ?,
    goal2_desc = ?,
    obj2_1_desc = ?,
    obj2_2_desc = ?,
    obj2_3_desc = ?,
    addgoal3 = ?,
    goal3_active = ?,
    goal3_desc = ?,
    obj3_1_desc = ?,
    obj3_2_desc = ?,
    obj3_3_desc = ?,
    addgoal4 = ?,
    goal4_active = ?,
    goal4_desc = ?,
    obj4_1_desc = ?,
    obj4_2_desc = ?,
    obj4_3_desc = ?,
    addgoal5 = ?,
    goal5_active = ?,
    goal5_desc = ?,
    obj5_1_desc = ?,
    obj5_2_desc = ?,
    obj5_3_desc = ?,
    addgoal6 = ?,
    goal6_active = ?,
    goal6_desc = ?,
    obj6_1_desc = ?,
    obj6_2_desc = ?,
    obj6_3_desc = ?,
    addgoal7 = ?,
    goal7_active = ?,
    goal7_desc = ?,
    obj7_1_desc = ?,
    obj7_2_desc = ?,
    obj7_3_desc = ?,
    addgoal8 = ?,
    goal8_active = ?,
    goal8_desc = ?,
    obj8_1_desc = ?,
    obj8_2_desc = ?,
    obj8_3_desc = ?,
    addgoal9 = ?,
    goal9_active = ?,
    goal9_desc = ?,
    obj9_1_desc = ?,
    obj9_2_desc = ?,
    obj9_3_desc = ?,
    addgoal10 = ?,
    goal10_active = ?,
    goal10_desc = ?,
    obj10_1_desc = ?,
    obj10_2_desc = ?,
    obj10_3_desc = ?
    WHERE id = ?`;
    try {
      return await query(sql, [
        // goal 1
        addgoal1,
        activeGoal1,
        goal1,
        obj1_1,
        obj1_2,
        obj1_3,
        // goal 2
        addgoal2,
        activeGoal2,
        goal2,
        obj2_1,
        obj2_2,
        obj2_3,
        // goal 3
        addgoal3,
        activeGoal3,
        goal3,
        obj3_1,
        obj3_2,
        obj3_3,
        // goal 4
        addgoal4,
        activeGoal4,
        goal4,
        obj4_1,
        obj4_2,
        obj4_3,
        // goal 5
        addgoal5,
        activeGoal5,
        goal5,
        obj5_1,
        obj5_2,
        obj5_3,
        // goal 6
        addgoal6,
        activeGoal6,
        goal6,
        obj6_1,
        obj6_2,
        obj6_3,
        // goal 7
        addgoal7,
        activeGoal7,
        goal7,
        obj7_1,
        obj7_2,
        obj7_3,
        // goal 8
        addgoal8,
        activeGoal8,
        goal8,
        obj8_1,
        obj8_2,
        obj8_3,
        // goal 9
        addgoal9,
        activeGoal9,
        goal9,
        obj9_1,
        obj9_2,
        obj9_3,
        // goal 10
        addgoal10,
        activeGoal10,
        goal10,
        obj10_1,
        obj10_2,
        obj10_3,
        // id
        id,
      ]);
    } catch (error) {
      console.log("exception: ", error);
      throw error;
    }
  }

  static async getNoteHist() {
    const sql = `SELECT id, event_id, date_format(note_date, '%m/%d/%Y') as noteDate, 
    date_format(session_date, '%m/%d/%Y') as sessionDate, attendance, client_id as clientID, type 
    FROM documents WHERE client_id = 1 `;

    try {
      return await query(sql);
    } catch (error) {
      throw error;
    }
  }
}

// export default ClientService;
module.exports = ClientService;
