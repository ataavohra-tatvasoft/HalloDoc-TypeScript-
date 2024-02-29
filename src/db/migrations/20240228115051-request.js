'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('request', {
      request_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      confirmation_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      request_state: {
        type: Sequelize.ENUM(
          "new",
          "active",
          "pending",
          "conclude",
          "toclose",
          "unpaid"
        ),
        allowNull: false,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Patient",
          key: "patient_id",
        },
      },  
      requested_by: {
        type: Sequelize.ENUM("family_friend", "concierge", "business_partner"),
        allowNull: false,
      },
      requestor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Requestor',
          key: "user_id",
        },
      },
      requested_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      notes_symptoms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      physician_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Provider',
          key: "provider_id",
        },
      },
      date_of_service: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      block_status: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      cancellation_status:{
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      close_case_status:{
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      transfer_request_status:{
        type: Sequelize.ENUM("undefined","pending","accepted","rejected"),
        defaultValue: "undefined",
        allowNull: false,
      },
      agreement_status:{
        type: Sequelize.ENUM("undefined","pending","accepted","rejected"),
        defaultValue: "undefined",
        allowNull: false,
      },
      assign_req_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      
    });

  
  },
};
