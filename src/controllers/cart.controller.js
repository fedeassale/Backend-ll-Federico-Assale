 import { cartService,productService } from "../services/index.js";
// import TicketModel from "../dao/models/ticket.model.js";
// import  { calcularTotal,generateUniqueCode }  from "../utils/cartutils.js";

import ticketService from "../services/ticket.service.js";

// import UserModel from "../dao/models/usuarios.model.js"; 



class CartController{
    async create(req,res){
        try {
            const newCart = await cartService.createCart();
            res.status(201).send(newCart);

        } catch (error) {
            res.status(500).send({ error: "Error al crear el carrito" });
        }
    }

    async getCart(req,res){
        const {cid} = req.params;
        try {
            const cart= await cartService.getCartById(cid);
            if(!cart) return res.status(404).send({ error: "Carrito no encontrado" });
            res.json(cart);
        } catch (error) {
            console.error("Error al obtener el carrito:", error);
            res.status(500).send({ error: "Error al leer el carrito" });
        }
    }


    async addProductToCart(req,res){
        const {cid,pid} = req.params;
        const {quantity=1} = req.body;//esto cambiar

        try {
            const cart= await cartService.getCartById(cid);
            if(!cart) return res.status(404).send({ error: "Carrito no encontrado" });

            const existingProduct = cart.products.find(item => item.product.toString()===pid);
            if(existingProduct) {
                existingProduct.quantity += quantity;
            } else{
                cart.products.push({product:pid,quantity})
            }
            const updatedCart = await cartService.updateCart(cid, cart);
            res.send(updatedCart);

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            res.status(500).send({ error: "Error al agregar productos al carrito" });
        }
    }


    async finalizarCompra(req, res) {
        const cartId = req.params.cid;
        const userEmail = req.user.email; // Asegúrate de que el usuario esté autenticado
    
        try {
            const { ticket, productosNoDisponibles } = await ticketService.createTicket(cartId, userEmail);
    
            // Maneja productos no disponibles (opcional)
            if (productosNoDisponibles.length > 0) {
                console.log("Productos no disponibles:", productosNoDisponibles);
                // Aquí puedes decidir si enviar un mensaje al cliente o realizar alguna acción
            }
    
            // Renderiza la vista de checkout
            res.render("checkout", {
                cliente: req.user.first_name,
                email: userEmail,
                numTicket: ticket._id
            });
        } catch (error) {
            console.log("Error al procesar la compra", error);
            res.status(500).send("Error interno del servidor");
        }
    }

   
    // async finalizarCompra(req, res) {
    //     const cartId = req.params.cid;
    //     try {
    //         const cart = await cartService.getCartById(cartId);
    //         const products = cart.products;
    //         const productosNoDisponibles = [];
    //         let total = 0;
    
    //         // Procesar cada producto en el carrito
    //         for (const item of products) {
    //             const productId = item.product;
    //             const product = await productService.getProductById(productId);
    
    //             if (product.stock >= item.quantity) {
    //                 product.stock -= item.quantity;
    //                 await product.save();
    //                 total += item.quantity * product.price; // Calcular el total
    //             } else {
    //                 productosNoDisponibles.push(productId); // Agregar producto no disponible
    //             }
    //         }
    
    //         // Obtener el usuario asociado al carrito
    //         const userWithCart = await UserModel.findOne({ cart: cartId });
    
    //         // Solo crear el ticket si hubo productos disponibles para la compra
    //         if (total > 0) {
    //             const ticket = new TicketModel({
    //                 code: generateUniqueCode(),
    //                 purchase_datetime: new Date(),
    //                 amount: total,  // Total calculado
    //                 purchaser: userWithCart.email // Usamos el email del comprador
    //             });
    //             await ticket.save();
    
    //             // Filtrar productos no disponibles del carrito
    //             cart.products = cart.products.filter(item => 
    //                 !productosNoDisponibles.includes(item.product.toString())
    //             );
    //             await cartService.saveCart(cart);
    
    //             // Renderizar la vista de checkout con los detalles
    //             res.render("checkout", {
    //                 cliente: userWithCart.first_name,
    //                 email: userWithCart.email,
    //                 numTicket: ticket._id
    //             });
    //         } else {
    //             // No hubo productos disponibles para la compra
    //             res.status(400).json({ message: "No hay productos disponibles para la compra" });
    //         }
    
    //     } catch (error) {
    //         console.log("Error al procesar la compra:", error);
    //         res.status(500).json({ message: "Error al procesar la compra" });
    //     }
    // }

    // async finalizarCompra(req,res){
    //     const cartId = req.params.cid;
    //     try {
    //         const cart = await cartService.getCartById(cartId);
    //         const products = cart.products;

    //         const productosNoDisponibles = [];

    //         for(const item of products){
    //             const productId = item.product;
    //             const product = await productService.getProductById(productId);
    //             if(product.quantity >= item.quantity){
    //                 product.quantity -= item.quantity;
    //                 await product.save();
    //                 }else{
    //                     productosNoDisponibles.push(productId);
    //                 }

    //                 const userWithCart = await UserModel.findOne({cart:cartId});

    //                 const ticket = new TicketModel({
    //                     code: generateUniqueCode(),
    //                     purchase_datime: new Date(),
    //                     amount: calcularTotal(cart.products),
    //                     purchaser: userWithCart._id
    //                 })
    //                 await ticket.save();
    //                 cart.products = cart.products.filter(item=>productosNoDisponibles.some(product=>productId.equal))
    //                 await cartService.save();

    //                 res.render("checkout",{
    //                     cliente: userWithCart.first_name,
    //                     email:userWithCart.email,
    //                     numTicket: ticket._id
    //                 })
    //         }

    //     } catch (error) {
    //         console.log("error al procesar la compra")
    //     }
    // }

    //falta aca actualizar y eliminar

}

export default CartController;