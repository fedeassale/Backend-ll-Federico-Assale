import { cartService,productService } from "../services/index.js";
import UserModel from "../dao/models/usuarios.model.js"; 
import  ticketService  from "../services/ticket.service.js";




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
        const {quantity=1} = req.body;//cambiar

        try {
            const cart= await cartService.getCartById(cid);
            if(!cart) return res.status(404).send({ error: "Carrito no encontrado" });
            const existingProduct = cart.products.find(item => String(item.product) === String(pid));
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
    
        try {
            const cart = await cartService.getCartById(cartId);
            const userWithCart = await UserModel.findOne({ cart: cartId });
    
            if (!cart || !userWithCart) {
                return res.status(404).json({ message: "Carrito o usuario no encontrado" });
            }
    
            let totalAmount = 0;
            const productosNoDisponibles = [];
    
            
            for (const item of cart.products) {
                const product = await productService.getProductById(item.product);
    
                
                if (product.stock >= item.quantity) {
                    product.stock -= item.quantity;  
                    totalAmount += product.price * item.quantity;  
                    await productService.updateProduct(product._id, { stock: product.stock });  
                } else {
                    productosNoDisponibles.push(item.product.toString());  
                }
            }
    
            cart.products = cart.products.filter(item => 
                productosNoDisponibles.includes(item.product.toString())
            );
    
            await cartService.updateCart(cartId, cart);  
    
            
            if (totalAmount > 0) {
                const ticket = await ticketService.createTicket(cart, userWithCart); 
    
                
                return res.status(200).json({
                    message: "Compra finalizada con éxito",
                    ticket,
                    productosNoDisponibles
                });
            } else {
                return res.status(400).json({
                    message: "No hay productos disponibles para completar la compra",
                    productosNoDisponibles
                });
            }
    
        } catch (error) {
            console.error("Error al procesar la compra:", error);
            res.status(500).json({ message: "Error interno al procesar la compra" });
        }
    }
//CON ESTE LO MANDARIA A LA VISTA, EL TEMA ES QUE USANDO POSTMAN NO ME SIRVE
    // async finalizarCompra(req, res) {
    //     const cartId = req.params.cid;
    
    //     try {
    //         
    //         const cart = await cartService.getCartById(cartId);
    //         const userWithCart = await UserModel.findOne({ cart: cartId });
    
    //         if (!cart || !userWithCart) {
    //             return res.status(404).json({ message: "Carrito o usuario no encontrado" });
    //         }
    
    //         let totalAmount = 0;
    //         const productosNoDisponibles = [];
    
    //         
    //         for (const item of cart.products) {
    //             const product = await productService.getProductById(item.product);
    
    //             if (product.stock >= item.quantity) {
    //                 product.stock -= item.quantity;
    //                 totalAmount += product.price * item.quantity;
    //                 await productService.updateProduct(product._id, { stock: product.stock });
    //             } else {
    //                 productosNoDisponibles.push(item.product.toString());
    //             }
    //         }
    
    //        
    //         cart.products = cart.products.filter(item => 
    //             !productosNoDisponibles.includes(item.product.toString())
    //         );
    
    //         await cartService.updateCart(cartId, cart);
    
    //         
    //         if (totalAmount > 0) {
    //             const ticket = await ticketService.createTicket(cart, userWithCart);
    
    //            
    //             return res.render('checkout', {
    //                 ticket,
    //                 failedProducts: productosNoDisponibles
    //             });
    //         } else {
    //             
    //             return res.render('checkout', {
    //                 ticket: null,
    //                 failedProducts: productosNoDisponibles
    //             });
    //         }
    
    //     } catch (error) {
    //         console.error("Error al procesar la compra:", error);
    //         res.status(500).json({ message: "Error interno al procesar la compra" });
    //     }
    // }

    async updateProductQuantity(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const { quantity } = req.body;
        try {
            const cart = await cartService.getCartById(cartId);
            console.log("Contenido del carrito:", JSON.stringify(cart, null, 2));
            console.log("Cart encontrado:", cart); // Verificar contenido del carrito
            if (!cart || !cart.products || cart.products.length === 0) {
                return res.status(404).json({ message: "El carrito está vacío o no se encontró" });
            }
            const product = await productService.getProductById(productId);
            console.log("Producto encontrado:", product); // Verificar si se obtiene el producto

            if (!product || product.stock < quantity) {
                return res.status(400).json({ message: "Insufficient stock" });
            }
            const existingProduct = cart.products.find(item => String(item.product._id) === String(productId));
            
            console.log("Producto existente en carrito:", existingProduct); // Verificar si se encuentra en el carrito
            if (existingProduct) {
                existingProduct.quantity = quantity;
                await productService.updateProduct(productId, { stock: product.stock - quantity });
                const updatedCart = await cartService.updateCart(cartId, cart);
                res.status(200).json({ message: "Product quantity updated successfully", cart: updatedCart });
            } else {
                res.status(404).json({ message: "Product not found in cart" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    async updateCart(req, res) {
        const cartId = req.params.cid;
        const updatedProducts = req.body.products; 
    
        try {
            
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }
    
           
            cart.products = updatedProducts.map(item => ({
                product: item.product,
                quantity: item.quantity
            }));
    
            
            const updatedCart = await cartService.updateCart(cartId, cart);
            
            res.status(200).json({ message: "Cart updated successfully", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async clearCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartService.getCartById(cartId);
            cart.products = [];
            const updatedCart = await cartService.updateCart(cartId, cart);
            res.status(200).json({ message: "All products removed successfully", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteProductFromCart(req, res) {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        try {
            const cart = await cartService.getCartById(cartId);
            cart.products = cart.products.filter(item => String(item.product._id) !== String(productId));
            const updatedCart = await cartService.updateCart(cartId, cart);
            res.status(200).json({ message: "Product removed successfully", cart: updatedCart });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

   
   


export default CartController;