    import express from "express";
import { getmyProfile, login, logout, register} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();


router.post("/new",register);

router.post("/login",login);

router.get("/me", isAuthenticated, getmyProfile);

router.get("/logout", logout);


export default router;