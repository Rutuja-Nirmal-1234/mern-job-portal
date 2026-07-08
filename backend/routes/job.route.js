import express from "express"
import isAutenticated from "../middlewares/isAuthenticated.js";
import { deleteJob, getAdminJobs, getAllJob, getJobById, postJob } from "../controllers/job.controller.js";

const router = express.Router();



router.route("/post").post(isAutenticated, postJob);
router.route("/get").get(isAutenticated, getAllJob);
router.route("/getadmin").get(isAutenticated, getAdminJobs);
router.route("/get/:id").get(isAutenticated, getJobById);
router.route("/:id").delete(isAutenticated, deleteJob);

export default router;

