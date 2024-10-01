import { query, Router } from "express";
const router = Router(); 
import ProductManager from "../dao/db/product-manager-db.js";

const manager = new ProductManager();


router.get("/", async (req, res) => {
    

    try{
        const { limit = 10, page = 1, sort, query } = req.query;

        const products = await manager.getProducts({
            limit: parseInt(limit),
            page: parseInt(page),
            sort,
            query,
        });
             res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
             })
        }
    catch(error){
        res.status(500).send(error.message);
    }
});

router.get("/:pid", async (req, res) => {
    let id = req.params.pid; 
    try {
        const product = await manager.getProductById(id); 
        if(!product) {
            res.send("product not found"); 
        } else {
            
            res.send(product); 
        }
    } catch (error) {
        res.send(error.message); 
    }
});

router.post("/",async(req,res)=>{
    const newProduct = req.body;
    try{await manager.addProduct(newProduct);
        res.send("add Product");
    }catch(error){
        res.status(500).send(error.message);
    }
});

router.put("/:pid",async(req,res)=>{
    try{
        const productId = req.params.pid
        const updatedProduct = req.body
        await manager.updateProduct(productId, updatedProduct)
        res.json({message:"Product updated successfully"})
    }catch(error){
        res.status(500).send(error.message)
    }
});

router.delete("/:pid",async(req,res)=>{
    try {
        const productId = req.params.pid;
        await manager.deleteProduct(productId);
        res.json({message:"Product deleted successfully"});
    } catch (error) {
        res.status(500).send(error.message);        
    }
});





export default router;