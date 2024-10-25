import ProductModel from "./models/product.model.js"

class ProductDao{
    async findById(id){
        return await ProductModel.findById(id);
    }
    
    async find(query) {
        
        const { limit = 10, page = 1, sort, query: searchQuery } = query;

        
        const filter = searchQuery ? { title: { $regex: searchQuery, $options: "i" } } : {};

        
        const limitNumber = Number(limit);
        const pageNumber = Number(page);

       
        const products = await ProductModel.find(filter)
            .limit(limitNumber) 
            .skip((pageNumber - 1) * limitNumber) 
            .sort(sort ? { price: sort === "desc" ? -1 : 1 } : {}); 

        return products;
    }
    async save(productData){
        const product = new ProductModel(productData)
        return await product.save();
    }
    async update(id, productData){
        return await ProductModel.findByIdAndUpdate(id,productData);
      
    }
    async delete(id){
        return await ProductModel.findByIdAndDelete(id);
    }

}

export default new ProductDao();