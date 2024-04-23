"use strict";

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcrypt");
module.exports = {
  async up(queryInterface, Sequelize) {
    const dob = new Date("2001-07-20");
    const password = "Password@6789";
    const hashed_password = await bcrypt.hash(password, 10);
    await queryInterface.bulkInsert(
      "user",
      [
        {
          user_id: 1,
          email: "honest@yopmail.com",
          password: hashed_password,
          username: "abcxyz",
          type_of_user: "admin",
          firstname: "XYZ",
          lastname: "ABC",
          mobile_no: 919834348503,
          address_1: "Room 1",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "active",
          // zip: 123456,
          // billing_mobile_no: 1234567890,
          dob: dob,
          business_name: "Meditab",
          street: "Nehrunagar",
          role_id: 8,
        },
        {
          user_id: 2,
          email: "rohitparmar@yopmail.com",
          username: "rohitparmar",
          type_of_user: "patient",
          firstname: "Rohit",
          lastname: "Parmar",
          mobile_no: 919201152758,
          address_1: "Room 1",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "pending",
          // zip: 123456,
          // billing_mobile_no: 1234567890,
          dob: dob,
          business_name: "Meditab",
          street: "Nehrunagar",
          role_id: 8,
        },
        {
          user_id: 3,
          email: "rushikeshrathod@yopmail.com",
          username: "rushikeshrathod",
          type_of_user: "patient",
          firstname: "Rushikesh",
          lastname: "Rathod",
          mobile_no: 919681252758,
          address_1: "Room 2",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          status: "pending",
          // zip: 234567,
          // billing_mobile_no: 2345678901,
          dob: dob,
          business_name: "Meditab",
          street: "Ambavadi",
          role_id: 8,
        },
        {
          user_id: 4,
          email: "sample@yopmail.com",
          username: "sample",
          type_of_user: "patient",
          firstname: "Ataa",
          lastname: "Vohra",
          mobile_no: 918201352758,
          address_1: "Room 3",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          status: "pending",
          // zip: 345678,
          // billing_mobile_no: 3456789012,
          dob: dob,
          business_name: "Meditab",
          street: "Bodakdev",
          role_id: 8,
        },
        {
          user_id: 5,
          email: "sachin_tendulkar@yopmail.com",
          username: "sachintendulkar",
          type_of_user: "patient",
          firstname: "Sachin",
          lastname: "Tendulkar",
          mobile_no: 918401736963,
          address_1: "Room 5",
          address_2: "Hostel",
          city: "City",
          state: "District Of Columbia",
          status: "pending",
          // zip: 456789,
          // billing_mobile_no: 4567890123,
          dob: dob,
          business_name: "Meditab",
          street: "Ambavadi",
          role_id: 8,
        },
        {
          user_id: 6,
          email: "sharmarohit@yopmail.com",
          username: "rohitsharma",
          type_of_user: "patient",
          firstname: "Rohit",
          lastname: "Sharma",
          mobile_no: 918789162758,
          address_1: "Room 6",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "pending",
          // zip: 567890,
          // billing_mobile_no: 5678901234,
          dob: dob,
          business_name: "Meditab",
          street: "Bodakdev",
          role_id: 8,
        },
        {
          user_id: 7,
          email: "billgates@yopmail.com",
          username: "billgates",
          password: hashed_password,
          type_of_user: "patient",
          firstname: "Bill ",
          lastname: "Gates",
          mobile_no: 917770172758,
          address_1: "Room 7",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          status: "active",
          // zip: 678901,
          // billing_mobile_no: 6789012345,
          dob: dob,
          business_name: "Meditab",
          street: "Prahladnagar",
          role_id: 8,
        },
        {
          user_id: 8,
          email: "arjunpatel@yopmail.com",
          username: "arjunpatel",
          type_of_user: "physician",
          firstname: "Arjun",
          lastname: "Patel",
          mobile_no: 918780429996,
          address_1: "Room 8",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "pending",
          // zip: 789012,
          // billing_mobile_no: 7890123456,
          dob: dob,
          street: "Prahladnagar",
          role_id: 2,
          on_call_status: "un-scheduled",
        },
        {
          user_id: 9,
          email: "rahulsharma@yopmail.com",
          username: "rahulsharma",
          type_of_user: "physician",
          firstname: "Rahul",
          lastname: "Sharma",
          mobile_no: 919824347503,
          address_1: "Room 9",
          address_2: "Hostel",
          city: "City",
          state: "District Of Columbia",
          status: "pending",
          // zip: 890123,
          // billing_mobile_no: 8901234567,
          dob: dob,
          street: "Ambavadi",
          role_id: 2,
          on_call_status: "un-scheduled",
        },
        {
          user_id: 10,
          email: "vikramsingh@yopmail.com",
          username: "vikramsingh",
          type_of_user: "physician",
          firstname: "Vikram",
          lastname: "Singh",
          password: hashed_password,
          mobile_no: 918402372758,
          address_1: "Room 10",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "active",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          on_call_status: "scheduled",
        },
        {
          user_id: 21,
          email: "devpatel@yopmail.com",
          username: "devpatel",
          type_of_user: "physician",
          firstname: "Dev",
          lastname: "Patel",
          mobile_no: 915603573758,
          address_1: "Room 11",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          status: "pending",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_1",
          on_call_status: "scheduled",
        },
        {
          user_id: 22,
          email: "mihirdave@yopmail.com",
          username: "mihirdave",
          type_of_user: "physician",
          firstname: "Mihir",
          lastname: "Dave",
          mobile_no: 916503573758,
          address_1: "Room 12",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          status: "pending",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_2",
          on_call_status: "scheduled",
        },
        {
          user_id: 23,
          email: "akashmalhotra@yopmail.com",
          username: "akashmalhotra",
          type_of_user: "physician",
          firstname: "Akash",
          lastname: "Malhotra",
          mobile_no: 919789573758,
          address_1: "Room 13",
          address_2: "Hostel",
          city: "City",
          state: "Virginia",
          status: "pending",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_3",
          on_call_status: "scheduled",
        },
        {
          user_id: 24,
          email: "ishaankishan@yopmail.com",
          username: "ishankishan",
          type_of_user: "physician",
          firstname: "Ishaan",
          lastname: "Kishan",
          mobile_no: 917946273758,
          address_1: "Room 14",
          address_2: "Hostel",
          city: "City",
          state: "New York",
          status: "pending",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_4",
          on_call_status: "scheduled",
        },
        {
          user_id: 25,
          email: "viratkohli@yopmail.com",
          username: "viratkohli",
          type_of_user: "physician",
          firstname: "Virat",
          lastname: "Kohli",
          mobile_no: 914909859658,
          address_1: "Room 15",
          address_2: "Hostel",
          city: "City",
          state: "Maryland",
          status: "pending",
          // zip: 901234,
          // billing_mobile_no: 9012345678,
          dob: dob,
          street: "Nehrunagar",
          role_id: 2,
          business_name: "business_5",
          on_call_status: "scheduled",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("user", null, {});
  },
};
