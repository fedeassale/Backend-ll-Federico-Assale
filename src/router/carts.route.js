import { Router } from "express";
const router = Router(); 
import CartController from "../controllers/cart.controller.js";
const controller = new CartController();




router.post("/",controller.create);

router.get("/:cid",controller.getCart);

router.post("/:cid/products/:pid",controller.addProductToCart);

router.post("/:cid/purchase", controller.finalizarCompra);

router.put('/:cid/products/:pid', controller.updateProductQuantity);

router.put("/:cid", controller.updateCart);

router.delete('/:cid/products/:pid', controller.deleteProductFromCart);

router.delete('/:cid', controller.clearCart);




export default router;

