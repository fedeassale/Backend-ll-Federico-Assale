import { Router } from "express";
const router = Router(); 
import UsuarioModel from "../models/usuarios.model.js";
import jwt from "jsonwebtoken"; 
import passport from "passport";
import { createHash, isValidPassword } from "../utils/util.js";
import CartModel from "../dao/models/carts.model.js";

router.post("/register", async (req, res) => {
    let {first_name,last_name, email, age, password} = req.body; 

    try { 
        const existeUsuario = await UsuarioModel.findOne({email: email}); 

        if (existeUsuario) {
            return res.status(400).send("El usuario ya existe");
        }

        const nuevoCarrito = new CartModel();
        await nuevoCarrito.save();

        //Creo usuario 
        const nuevoUsuario = new UsuarioModel({
            first_name,
            last_name,
            email,
            cart:nuevoCarrito._id,
            password: createHash(password),
            age
        });

        await nuevoUsuario.save(); 

        //Genero token
        const token = jwt.sign({email: nuevoUsuario.email}, "coderhouse", {expiresIn: "1h"}); 

        //Creo cookie
        res.cookie("coderCookieToken", token, {
            maxAge: 3600000, 
            httpOnly: true
        })

        res.redirect("/api/sessions/current"); 

    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})

//Login: 

router.post("/login", async (req, res) => {    
    let {email, password} = req.body; 
    try {
        //Busco uusario bd
        const usuarioEncontrado = await UsuarioModel.findOne({usuario: email}); 

        if (!usuarioEncontrado) {
            return res.status(401).send("Usuario no identificado"); 
        }

        if(!isValidPassword(password, usuarioEncontrado)) {
            return res.status(401).send("Contraseña incorrecta"); 
        }

         const token = jwt.sign({usuario: usuarioEncontrado.email, first_name: usuarioEncontrado.first_name, rol: usuarioEncontrado.rol}, "coderhouse", {expiresIn: "1h"}); 

         res.cookie("coderCookieToken", token, {
             maxAge: 3600000, 
             httpOnly: true
         })
 
         res.redirect("/api/sessions/current"); 


    } catch (error) {
        res.status(500).send("Error interno del servidor"); 
    }
})

router.get("/current", passport.authenticate("current", {session: false}), (req, res) => {
     res.render("home", { usuario: req.user.usuario}); 
 })

router.post("/logout", (req, res) => {
    res.clearCookie("coderCookieToken"); 
    res.redirect("/login"); 
})

router.get("/admin", passport.authenticate("current", {session: false}), (req, res) => {
    if(req.user.rol !== "admin") {
        return res.status(403).send("Acceso denegado"); 
    }
 
    res.render("admin");
})


export default router; 