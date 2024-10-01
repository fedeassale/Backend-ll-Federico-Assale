import express from "express";
import productRouter from "./router/products.router.js";
import cartsRouter from "./router/carts.route.js";
import viewsRouter from "./router/views.router.js";
import usersRouter from "./router/user.router.js";
// import  { Server } from "socket.io";
import {engine} from "express-handlebars";
// import ProductModels from "./dao/models/product.model.js"
import "./database.js";
import ProductManager from "./dao/db/product-manager-db.js";
// const manager = new ProductManager();
import cookieParser from "cookie-parser";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

const app = express(); 
const PUERTO = 8080;
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use(cookieParser());
app.use(passport.initialize()); 
initializePassport(); 

app.engine("handlebars",engine());
app.set("view engine","handlebars");
app.set("views", "./src/views");

app.use("/api/products",productRouter);
app.use("/api/carts",cartsRouter);
app.use("/",viewsRouter);
app.use("/api/sessions", usersRouter); 

const httpServer= app.listen(PUERTO, () => {
    console.log(`Escuchando en el http://localhost:${PUERTO}`); 
})

// const io = new Server(httpServer);

// io.on("connection", async(socket)=>{
//     console.log("Cliente conectado");

//     socket.emit("productos", await manager.getProducts());

//      socket.on("eliminarProducto", async(id)=>{
//          await manager.deleteProduct(id);

//          io.sockets.emit("productos", await manager.getProducts());
//         });
//     socket.on("addProduct", async (product) => {
//             await manager.addProduct(product);
//             io.sockets.emit("productos", await manager.getProducts());
//     })
//  })




