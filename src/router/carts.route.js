import { Router } from "express";
const router = Router(); 
import CartController from "../controllers/cart.controller.js";
const controller = new CartController();




router.post("/",controller.create);

router.get("/:cid",controller.getCart);

router.post("/:cid/products/:pid",controller.addProductToCart);

router.post("/:cid/purchase", controller.finalizarCompra);
//eliminar y actualizar

export default router;





























// router.get('/', async (req, res)=>{
//     try {
//         const allCarts = await CartModel.find().populate('products.product')
//         res.status(200).json(allCarts)
//     } catch (error) {
//         res.status(500).send({ status: 'Error', message:error.message  })
//     }
// })

// router.post("/", async (req, res) => {
//     try {
//          const nuevoCarrito = await cartManager.crearCarrito(); 
//          res.json(nuevoCarrito);

//     } catch (error) {
//         res.status(500).send("Server error");
//     }
// })

// router.get("/:cid", async (req, res) => {

//     try {
//         const carrito = await cartManager.getCarritoById(req.params.cid); 
//         res.status(200).json(carrito.products); 
//     } catch (error) {
//         res.status(500).send("Error getting products from cart"); 
//     }
// })

// router.post("/:cid/products/:pid", async (req, res) => {
//     let carritoId = req.params.cid; 
//     let productId = req.params.pid; 
//     let quantity = req.body.quantity || 1; 

//     try {
//         const actualizado = await cartManager.agregarProductosAlCarrito(carritoId, productId, quantity); 
//         res.status(200).json(actualizado.products); 
//     } catch (error) {
//         res.status(500).send("Error adding a product");
//     }
// })
// router.delete('/:cid/products/:pid', async(req,res) => {
//     const cartId =req.params.cid
//     const productId = req.params.pid
//     try {
//         const result = await cartManager.deleteProducts(cartId, productId)
//         if (!result){
//             res.status(200).json({status:'success', message:'product deleted in cart successfully',result})
//         } else {
//             res.status(404).send('Cart not found')
//         }
//     } catch (error) {
//         res.status(500).send({ error: error.message, message:"DEL Error with pid in cid" })
//     }
// })

// router.delete("/:cid", async (req, res) => {
//     try {
//         const  cartId  = req.params.cid;

//         // Llama al manager para vaciar el carrito
//         const updatedCart = await cartManager.clearCart(cartId);

//         res.json({ message: "All products removed successfully", cart: updatedCart });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// router.put("/:cid/products/:pid", async (req, res) => {
//         try {
//             const carritoId = req.params.cid;
//             const productId = req.params.pid;
//             const { quantity } = req.body;
    
            
//             await cartManager.updateProductQuantity(carritoId, productId, quantity);
    
//             res.json({ message: "Product quantity updated successfully" });
//         } catch (error) {
//             res.status(500).send(error.message);
//         }
//     });

// router.put("/:cid", async (req, res) => {
//         try {
//             const  carritoId  = req.params.cid;
//             const updatedProducts = req.body.products;
    
//             // Llama al manager para actualizar el carrito completo
//             const updatedCart = await cartManager.updateCart(carritoId, updatedProducts);
    
//             res.json({ message: "Cart updated successfully", cart: updatedCart });
//         } catch (error) {
//             res.status(500).send(error.message);
//         }
//     });

