import { productService } from "../services/index.js";

class ProductController {
    async getProducts(req, res) {
        const{ limit= 10, page = 1, sort,query} = req.query;
        try {
            const products = await productService.getProducts({limit, page, sort,query});
            res.send(products);
        } catch (error) {
            res.status(500).send("Error interno del servidor");

        }
    }

    async getProductsById(req,res){
        const{ id } = req.params;
        try {
            const product = await productService.getProductById(id);
            if(!product) return res.status(404).send("Producto no encontrado");
            res.send(product);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }
    async createProduct(req,res){
        try {
            const product = await productService.createProduct(req.body);
            res.status(201).send(product);
        } catch (error) {
            res.status(500).send("Error interno del servidor");
        }
    }

    //Agregar, actualizar y eliminar
}

export default ProductController;