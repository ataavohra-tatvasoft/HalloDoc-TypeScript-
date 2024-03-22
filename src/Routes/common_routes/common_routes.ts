import express, { Router } from "express";
import { regions, professions, export_one } from "../../controllers";
import { authmiddleware } from "../../middlewares";

const router: Router = express.Router();

router.get("/commonroute/regions", authmiddleware, regions);
router.get("/commonroute/professions", authmiddleware, professions);
router.get("/commonroute/export", authmiddleware, export_one);

export default router;
