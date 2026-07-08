import express from "express";
import isAutenticated from "../middlewares/isAuthenticated.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(isAutenticated, applyJob);
router.route("/get").get(isAutenticated, getAppliedJobs);
router.route("/:id/applicants").get(isAutenticated, getApplicants);
router.route("/status/:id/update").post(isAutenticated, updateStatus);

export default router;
