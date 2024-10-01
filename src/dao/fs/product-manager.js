import fs from "fs/promises"


class ProductManager {
    static ultId = 0;

    constructor(path) {
        this.products = [];
        this.path = path;
        this.initialize();
    }
    async initialize() {
        try {
            const arrayProductos = await this.leerArchivo();
            this.products = arrayProductos;
            if (arrayProductos.length > 0) {
                ProductManager.ultId = Math.max(...arrayProductos.map(product => product.id));
            }
        } catch (error) {
            console.log("Error initializing ProductManager:", error);
        }
    }

    async getProducts() {
        try {
            const arrayProducts = await this.leerArchivo(); 
            return arrayProducts;
        } catch (error) {
            console.log("Error reading file", error); 
        }
    }

    async getProductById(id) {
        try {
            const arrayProducts = await this.leerArchivo();
            const buscado = arrayProducts.find(item => item.id === id); 

            if (!buscado) {
                console.log("product not found"); 
                return null; 
            } else {
                console.log("Product found"); 
                return buscado; 
            }
        } catch (error) {
            console.log("Error searching by id", error); 
        }
    }

    async addProduct({ title, description, price, status,category, code, stock, thumbnails = [] }) {

          if (!title || !description || !price || status===undefined || !category || !code || !stock) {
              console.log("All fields are required");
             return;
            
          }

        if (this.products.some(item => item.code === code)) {
            console.log("The code must be unique");
            return;
        }
        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        }
        this.products.push(newProduct);
        await this.guardarArchivo(this.products);
    }

    async leerArchivo() {
        const response = await fs.readFile(this.path, "utf-8");
        const arrayProducts = JSON.parse(response);
        return arrayProducts;
    }

    async guardarArchivo(arrayProducts) {
        await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    }

    async updateProduct(id, updatedProduct) {
        try {
            const arrayProducts = await this.leerArchivo(); 

            const index = arrayProducts.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProducts[index] = {...arrayProducts[index], ...updatedProduct} ; 
                await this.guardarArchivo(arrayProducts); 
                console.log("updated product"); 
            } else {
                console.log("Product not found"); 
            }
        } catch (error) {
            console.log("We have an error updating products",error); 
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProducts = await this.leerArchivo(); 

            const index = arrayProducts.findIndex( item => item.id === id); 

            if(index !== -1) {
                arrayProducts.splice(index, 1); 
                await this.guardarArchivo(arrayProducts); 
                console.log("Product removed"); 
            } else {
                console.log("Product not found"); 
            }
        } catch (error) {
            console.log("We have an error deleting products"); 
        }
    }
}

export default ProductManager;

