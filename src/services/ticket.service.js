import ticketRepository from "../repositories/ticket.repository.js";
import {cartService,productService } from "./index.js";
import  generateUniqueCode from "../utils/cartutils.js";

class TicketService {
    async createTicket(cartId, userEmail) {
        const cart = await cartService.getCartById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const productosNoDisponibles = [];
        const successfulProducts = [];
        let totalAmount = 0;

        for (const item of cart.products) {
            const product = await productService.getProductById(item.product);
            if (!product || product.stock < item.quantity) {
                productosNoDisponibles.push(item.product);
                continue;
            }

            product.stock -= item.quantity;
            await product.save();
            totalAmount += product.price * item.quantity;
            successfulProducts.push(item.product);
        }

        // Crear ticket si hay productos exitosos
        if (successfulProducts.length > 0) {
            const ticketData = {
                code: generateUniqueCode(),
                amount: totalAmount,
                purchaser: userEmail,
                purchase_datetime: new Date()
            };

            const ticket = await ticketRepository.createTicket(ticketData);
            return { ticket, productosNoDisponibles };
        }

        return { productosNoDisponibles };
    }
}

export default new TicketService();


// import ticketRepository from "../repositories/ticket.repository.js";
// import cartService from "./cart.service.js";
// import productService from "./product.service.js";
// import { generateUniqueCode, calcularTotal } from "../utils/utils.js"; // Asegúrate de importar correctamente

// class TicketService {
//     // No necesitas un método generateUniqueCode aquí ya que usas el de utils
//     // generateUniqueCode() {
//     //     return nanoid();
//     // }

//     async createTicket(cartId, userEmail) {
//         const cart = await cartService.getCartById(cartId);
//         if (!cart) throw new Error("Carrito no encontrado");

//         const failedProducts = [];
//         const successfulProducts = [];
//         let totalAmount = 0;

//         // Verificar stock y procesar cada producto
//         for (const item of cart.products) {
//             const product = await productService.getProductById(item.product);
//             if (!product) {
//                 failedProducts.push(item.product);
//                 continue;
//             }

//             if (product.stock >= item.quantity) {
//                 // Actualizar stock
//                 product.stock -= item.quantity;
//                 await productService.updateProduct(product._id, { stock: product.stock });
                
//                 totalAmount += product.price * item.quantity; // Usar item para calcular el total
//                 successfulProducts.push(item.product);
//             } else {
//                 failedProducts.push(item.product);
//             }
//         }

//         // Si se procesó al menos un producto, crear ticket
//         if (successfulProducts.length > 0) {
//             const ticketData = {
//                 code: generateUniqueCode(), // Genera el código de ticket
//                 amount: calcularTotal(cart.products), // Calcula el total utilizando la función de utils
//                 purchaser: userEmail,
//                 purchase_datetime: new Date()
//             };

//             const ticket = await ticketRepository.createTicket(ticketData);

//             // Actualizar carrito solo con productos fallidos
//             const updatedCart = cart.products.filter(item => 
//                 failedProducts.includes(item.product.toString())
//             );
//             await cartService.updateCart(cartId, { products: updatedCart });

//             return {
//                 ticket,
//                 failedProducts
//             };
//         }

//         return { failedProducts };
//     }
// }

// export default new TicketService();