import { Router } from "express";
const router = Router(); 
import ProductManager from "../dao/db/product-manager-db.js";
const manager = new ProductManager();
import ProductModels from "../dao/models/product.model.js";
import CartManager from "../dao/db/cart-manager-db.js";
const cartManager = new CartManager();


router.get("/login", (req, res) => {
    res.render("login"); 
})

router.get("/register", (req, res) => {
    res.render("register"); 
})

router.get("/api/sessions/current",async (req,res)=>{
    let page = req.query.page|| 1;
    let limit = 2;
   
    const listadoProductos= await ProductModels.paginate({},{limit, page});

    const productoResultadoFinal = listadoProductos.docs.map(producto=>{
        const{_id, ...rest} =producto.toObject();
        return rest;
    })
    res.render("home",{
        productos:productoResultadoFinal,
        hasPrevPage: listadoProductos.hasPrevPage,
        hasNextPage: listadoProductos.hasNextPage,
        prevPage: listadoProductos.prevPage,
        nextPage: listadoProductos.nextPage,
        currentPage: listadoProductos.page,
        totalPages: listadoProductos.totalPages
    })
})

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartManager.getCarritoById(cartId);

        if (!cart ) {
            console.error("Error al obtener el carrito:");
             res.status(404);
        }

        const processedCart = {
            _id: cart._id.toString(),
            cart: cart.products.map(item => ({
                productId: item.product._id.toString(),
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity,
                _id: item._id.toString()
            }))
        };

        res.render('cart', {
            cart: processedCart
        });

    } catch (error) {
        console.error("Error al obtener el carrito:");
        res.status(500);
    }
});

router.get("/realtimeproducts",async (req,res)=>{
    res.render("realtimeproducts");
});

export default router