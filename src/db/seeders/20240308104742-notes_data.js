"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "notes",
      [
        {
          request_id: 1,
          note_id: 1,
          reason: "Reason 1",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 2,
          note_id: 2,
          reason: "Reason 2",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 3,
          note_id: 3,
          reason: "Reason 3",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 4,
          note_id: 4,
          reason: "Reason 4",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   request_id: 5,
        //   note_id: 5,
        //   reason: "Reason 5",
        //   description: "This is a sample note",
        //   type_of_note: "admin_notes"
        // },
        {
          request_id: 6,
          note_id: 6,
          reason: "Reason 6",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 7,
          note_id: 7,
          reason: "Reason 7",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 8,
          note_id: 8,
          reason: "Reason 8",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 9,
          note_id: 9,
          reason: "Reason 9",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 10,
          note_id: 10,
          reason: "Reason 10",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 11,
          note_id: 11,
          reason: "Reason 11",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 12,
          note_id: 12,
          reason: "Reason 12",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 13,
          note_id: 13,
          reason: "Reason 13",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 14,
          note_id: 14,
          reason: "Reason 14",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 15,
          note_id: 15,
          reason: "Reason 15",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 16,
          note_id: 16,
          reason: "Reason 16",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 17,
          note_id: 17,
          reason: "Reason 17",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 18,
          note_id: 18,
          reason: "Reason 18",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 19,
          note_id: 19,
          reason: "Reason 19",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 20,
          note_id: 20,
          reason: "Reason 20",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 21,
          note_id: 21,
          reason: "Reason 21",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 22,
          note_id: 22,
          reason: "Reason 22",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 23,
          note_id: 23,
          reason: "Reason 23",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 24,
          note_id: 24,
          reason: "Reason 24",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 25,
          note_id: 25,
          reason: "Reason 25",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 26,
          note_id: 26,
          reason: "Reason 26",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 27,
          note_id: 27,
          reason: "Reason 27",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 28,
          note_id: 28,
          reason: "Reason 28",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 29,
          note_id: 29,
          reason: "Reason 29",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 30,
          note_id: 30,
          reason: "Reason 30",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 31,
          note_id: 31,
          reason: "Reason 31",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 32,
          note_id: 32,
          reason: "Reason 32",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 33,
          note_id: 33,
          reason: "Reason 33",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 34,
          note_id: 34,
          reason: "Reason 34",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 35,
          note_id: 35,
          reason: "Reason 35",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 36,
          note_id: 36,
          reason: "Reason 36",
          description: "This is a sample note",
          type_of_note: "admin_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 1,
          note_id: 37,
          reason: "Reason 1",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 2,
          note_id: 38,
          reason: "Reason 2",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 3,
          note_id: 39,
          reason: "Reason 3",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 4,
          note_id: 40,
          reason: "Reason 4",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        // {
        //   request_id: 5,
        //   note_id: 41,
        //   reason: "Reason 5",
        //   description: "This is a sample note",
        //   type_of_note: "patient_notes"
        // },
        {
          request_id: 6,
          note_id: 42,
          reason: "Reason 6",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 7,
          note_id: 43,
          reason: "Reason 7",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 8,
          note_id: 44,
          reason: "Reason 8",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 9,
          note_id: 45,
          reason: "Reason 9",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 10,
          note_id: 46,
          reason: "Reason 10",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 11,
          note_id: 47,
          reason: "Reason 11",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 12,
          note_id: 48,
          reason: "Reason 12",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 13,
          note_id: 49,
          reason: "Reason 13",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 14,
          note_id: 50,
          reason: "Reason 14",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 15,
          note_id: 51,
          reason: "Reason 15",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 16,
          note_id: 52,
          reason: "Reason 16",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 17,
          note_id: 53,
          reason: "Reason 17",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 18,
          note_id: 54,
          reason: "Reason 18",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 19,
          note_id: 55,
          reason: "Reason 19",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 20,
          note_id: 56,
          reason: "Reason 20",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 21,
          note_id: 57,
          reason: "Reason 21",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 22,
          note_id: 58,
          reason: "Reason 22",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 23,
          note_id: 59,
          reason: "Reason 23",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 24,
          note_id: 60,
          reason: "Reason 24",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 25,
          note_id: 61,
          reason: "Reason 25",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 26,
          note_id: 62,
          reason: "Reason 26",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 27,
          note_id: 63,
          reason: "Reason 27",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 28,
          note_id: 64,
          reason: "Reason 28",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 29,
          note_id: 65,
          reason: "Reason 29",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 30,
          note_id: 66,
          reason: "Reason 30",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 31,
          note_id: 67,
          reason: "Reason 31",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 32,
          note_id: 68,
          reason: "Reason 32",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 33,
          note_id: 69,
          reason: "Reason 33",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 34,
          note_id: 70,
          reason: "Reason 34",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 35,
          note_id: 71,
          reason: "Reason 35",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          request_id: 36,
          note_id: 72,
          reason: "Reason 36",
          description: "This is a sample note",
          type_of_note: "patient_notes",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notes", null, {});
  },
};
