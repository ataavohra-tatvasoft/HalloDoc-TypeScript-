"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import { Sequelize } from "sequelize";
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "config.env" });
const user_2_1 = __importDefault(require("../db/models/user_2"));
const request_2_1 = __importDefault(require("../db/models/request_2"));
const requestor_2_1 = __importDefault(require("../db/models/requestor_2"));
const notes_2_1 = __importDefault(require("../db/models/notes_2"));
const order_2_1 = __importDefault(require("../db/models/order_2"));
const documents_2_1 = __importDefault(require("../db/models/documents_2"));
const region_2_1 = __importDefault(require("../db/models/region_2"));
const profession_2_1 = __importDefault(require("../db/models/profession_2"));
// const sequelize = new Sequelize(
//   "hallodoc",
//   process.env.DB_USER as string,
//   process.env.DB_PASS,
//   {
//     dialect: "mysql",
//     host: 'localhost',
//     define: {
//       freezeTableName: true,
//     },
//   },
// );
const sequelize = new sequelize_typescript_1.Sequelize({
    database: "hallodoc",
    dialect: "mysql",
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    storage: ":memory:",
    models: [
        user_2_1.default,
        region_2_1.default,
        request_2_1.default,
        requestor_2_1.default,
        profession_2_1.default,
        notes_2_1.default,
        order_2_1.default,
        documents_2_1.default,
    ],
});
const connection = sequelize.authenticate();
/** Connection to Database */
connection
    .then(() => {
    console.log("Connected to database :-) ");
})
    .catch((error) => {
    console.log("Error Occurred =>", error);
});
exports.default = sequelize;
