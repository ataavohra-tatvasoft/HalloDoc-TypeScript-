"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../connections/database"));
class Order extends sequelize_1.Model {
}
Order.init({
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    requestId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Request",
            key: 'request_id',
        },
    },
    request_state: {
        type: sequelize_1.DataTypes.ENUM("active", "conclude", "toclose"),
        allowNull: false,
    },
    profession: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    businessName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    businessContact: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    faxNumber: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    orderDetails: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    numberOfRefill: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
}, { timestamps: true,
    sequelize: database_1.default,
    tableName: 'order',
});
exports.default = Order;
