import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async(req, res) => {
    try{
        const products = await Product.find({}); // if we pass empty object, indicates to fetch all the products
        res.status(200).json({success : true, data : products, message : "Listed all the Products"});
    }catch (error){
        console.error("Error in fetching products", error.message);
        res.status(500).json({success:false, message : "Server Error"});
    }
}

export const createProducts = async(req, res)=>{
    const product = req.body;
    if(!product.name || !product.price || !product.image){
        return res.status(400).json({success :false, message : "Please provide all the fields"});
    } 
    const newProduct = new Product(product);
    try {
        await newProduct.save();
        res.status(201).json({success : true, data : newProduct});
    }catch(error){
        console.error("Error in created product", error.message);
        res.status(500).json({success:false, message : "Server Error"});
    }
}

export const updateProduct = async(req, res) => {
    const { id } = req.params;
    const product = req.body;
    // Check if ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }
    try {
        // Update the product by ID
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
}

export const deleteProduct = async(req, res) => {
    const { id } = req.params;
    console.log(id);
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        console.error("Product is not deleted", error.message);
        res.status(500).json({ success: false, message: "Product deletion failed" });
    }
}