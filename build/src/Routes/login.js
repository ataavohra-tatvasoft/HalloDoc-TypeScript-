"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const router = express_1.default.Router();
router.post("/adminlogin", (req, res, next) => {
    (0, controllers_1.admin_login)(req, res, next);
});
router.post("/patientlogin", (req, res, next) => {
    (0, controllers_1.patient_login)(req, res, next);
});
router.post("/providerlogin", (req, res, next) => {
    (0, controllers_1.provider_login)(req, res, next);
});
exports.default = router;
