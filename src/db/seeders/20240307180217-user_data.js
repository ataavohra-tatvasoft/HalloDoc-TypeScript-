"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dob = new Date("2001-07-20");
    await queryInterface.bulkInsert(
      "user",
      [
        {
          user_id: 2,
          email: "rohitparmar@outlook.com",
          type_of_user: "patient",
          firstname: "Rohit",
          lastname: "Parmar",
          mobile_no: 9201152758,
          address_1: "Room 1",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          // zip: 123456,
          // billing_mobile_no: 1234567890,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Nehrunagar",
          role_id: 1,
        },
        {
          user_id: 3,
          email: "rushikeshrathod@outlook.com",
          type_of_user: "patient",
          firstname: "Rushikesh",
          lastname: "Rathod",
          mobile_no: 9681252758,
          address_1: "Room 2",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          // zip: 234567,
          // billing_mobile_no: 2345678901,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Ambavadi",
          role_id: 2,
        },
        {
          user_id: 4,
          email: "sample@yopmail.com",
          type_of_user: "patient",
          firstname: "Ataa",
          lastname: "Vohra",
          mobile_no: 8201352758,
          address_1: "Room 3",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          // zip: 345678,
          // billing_mobile_no: 3456789012,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Bodakdev",
          role_id: 3,
        },
        {
          user_id: 5,
          email: "sachintendulkar@outlook.com",
          type_of_user: "patient",
          firstname: "Sachin",
          lastname: "Tendulkar",
          mobile_no: 8999552758,
          address_1: "Room 5",
          address_2: "Hostel",
          city: "City",
          state: "District Of Columbia",
          // zip: 456789,
          // billing_mobile_no: 4567890123,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Ambavadi",
          role_id: 4,
        },
        {
          user_id: 6,
          email: "sharmarohit@outlook.com",
          type_of_user: "patient",
          firstname: "Rohit",
          lastname: "Sharma",
          mobile_no: 8789162758,
          address_1: "Room 6",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          // zip: 567890,
          // billing_mobile_no: 5678901234,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Bodakdev",
          role_id: 1,
        },
        {
          user_id: 7,
          email: "billgates@outlook.com",
          type_of_user: "patient",
          firstname: "Bill ",
          lastname: "Gates",
          mobile_no: 7770172758,
          address_1: "Room 7",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          // zip: 678901,
          // billing_mobile_no: 6789012345,
          status: "active",
          dob: dob,
          business_name: "Meditab",
          street: "Prahladnagar",
          role_id: 2,
        },
        {
          user_id: 8,
          email: "arjunpatel@outlook.com",
          type_of_user: "physician",
          firstname: "Arjun",
          lastname: "Patel",
          mobile_no: 8802172758,
          address_1: "Room 8",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          // zip: 789012,
          // billing_mobile_no: 7890123456,
          status: "active",
          dob: dob,
          street: "Prahladnagar",
          role_id: 3,
          on_call_status: "yes",
        },
        {
          user_id: 9,
          email: "rahulsharma@outlook.com",
          type_of_user: "physician",
          firstname: "Rahul",
          lastname: "Sharma",
          mobile_no: 4802272758,
          address_1: "Room 9",
          address_2: "Hostel",
          city: "City",
          state: "District Of Columbia",
          // zip: 890123,
          // billing_mobile_no: 8901234567,
          status: "active",
          dob: dob,
          street: "Ambavadi",
          role_id: 4,
          on_call_status: "yes",
        },
        {
          user_id: 10,
          email: "vikramsingh@outlook.com",
          type_of_user: "physician",
          firstname: "Vikram",
          lastname: "Singh",
          mobile_no: 8402372758,
          address_1: "Room 10",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 1,
          on_call_status: "yes",
        },
        {
          user_id: 21,
          email: "devpatel@outlook.com",
          type_of_user: "physician",
          firstname: "Dev",
          lastname: "Patel",
          mobile_no: 5603573758,
          address_1: "Room 11",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_1",
          on_call_status: "yes",
        },
        {
          user_id: 22,
          email: "mihirdave@outlook.com",
          type_of_user: "physician",
          firstname: "Mihir",
          lastname: "Dave",
          mobile_no: 6503573758,
          address_1: "Room 12",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 3,
          business_name: "business_2",
          on_call_status: "yes",
        },
        {
          user_id: 23,
          email: "akashmalhotra@outlook.com",
          type_of_user: "physician",
          firstname: "Akash",
          lastname: "Malhotra",
          mobile_no: 9789573758,
          address_1: "Room 13",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 4,
          business_name: "business_3",
          on_call_status: "yes",
        },
        {
          user_id: 24,
          email: "ishaankishan@outlook.com",
          type_of_user: "physician",
          firstname: "Ishaan",
          lastname: "Kishan",
          mobile_no: 7946273758,
          address_1: "Room 14",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 1,
          business_name: "business_4",
          on_call_status: "yes",
        },
        {
          user_id: 25,
          email: "viratkohli@outlook.com",
          type_of_user: "physician",
          firstname: "Virat",
          lastname: "Kohli",
          mobile_no: 4909859658,
          address_1: "Room 15",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          status: "active",
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_5",
          on_call_status: "yes",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
