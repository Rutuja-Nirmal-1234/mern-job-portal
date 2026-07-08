import express from "express"
import { register, login, updateProfile, logout } from "../controllers/user.controller.js";
import isAutenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/profile/update").post(isAutenticated, singleUpload, updateProfile);
router.route("/logout").get(logout);


export default router;

