import { Router } from "express";
const router = Router(); 
// import UsuarioModel from "../models/usuarios.model.js";
// import jwt from "jsonwebtoken"; 
import passport from "passport";
import UserController from "../controllers/user.controller.js";
const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/current", passport.authenticate("jwt",{session: false}),userController.current);
router.post("/logout",userController.logout);



export default router; 
