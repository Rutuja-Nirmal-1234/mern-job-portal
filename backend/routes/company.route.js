import express from "express"
import isAutenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(isAutenticated, registerCompany);
router.route("/get").get(isAutenticated, getCompany);
router.route("/get/:id").get(isAutenticated, getCompanyById);
router.route("/update/:id").put(
  isAutenticated,
  singleUpload,
  updateCompany
);


export default router;

