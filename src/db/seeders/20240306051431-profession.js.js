'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "profession",
      [
        { profession_id: 1, profession_name: "Profession 1" },
        { profession_id: 2, profession_name: "Profession 2" },
        { profession_id: 3, profession_name: "Profession 3" },
        { profession_id: 4, profession_name: "Profession 4" },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("profession", null, {});
  }
};