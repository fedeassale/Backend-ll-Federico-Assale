import { productService } from "../services/index.js";

class ProductController {
    async getProducts(req, res) {
        const { limit = 10, page = 1, sort, query } = req.query;
        try {
            const products = await productService.getProducts({ limit, page, sort, query });
            res.status(200).json(products); 
        } catch (error) {
            console.error("Error al obtener productos:", error); 
            res.status(500).json({ message: "Error interno del servidor" }); 
        }
    }

    async getProductsById(req,res){
        const{ pid } = req.params;
        try {
            const product = await productService.getProductById(pid);
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

    async updateProduct(req, res) {
        const { pid } = req.params; 
        const updatedProduct = req.body; 
        try {
            const product = await productService.updateProduct(pid, updatedProduct); 
            if (!product) {
                return res.status(404).json({ message: "Product not found" }); 
            }
            res.status(200).json({ message: "Product updated successfully", product });
        } catch (error) {
            console.error("Error al actualizar producto:", error); 
            res.status(500).json({ message: "Error interno del servidor" }); 
        }
    }

    async deleteProduct(req, res) {
        const { pid } = req.params;   
        try {
            const product = await productService.deleteProduct(pid); 
            if (!product) {
                return res.status(404).json({ message: "Product not found" }); 
            }
            res.status(200).json({ message: "Product deleted successfully" }); 
        } catch (error) {
            console.error("Error al eliminar producto:", error); 
            res.status(500).json({ message: "Error interno del servidor" }); 
        }
    }
}

export default ProductController;