import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
import Product from '../models/productModel.js';
import fs from 'fs';
import path from 'path';

// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for list product
const listProducts = async (req, res) => {
    try {
        
        const products = await productModel.find({});
        res.json({success:true,products})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for removing product
const removeProduct = async (req, res) => {
    try {
        
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {
        
        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({success:true,product})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    try {
        console.log('Update request received:', {
            params: req.params,
            body: req.body,
            files: req.files
        });

        const { id } = req.params;
        const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Update basic fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = Number(price) || product.price;
        product.category = category || product.category;
        product.subCategory = subCategory || product.subCategory;
        product.sizes = sizes ? JSON.parse(sizes) : product.sizes;
        product.bestseller = bestseller === "true" ? true : false;

        // Handle image updates
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const newImages = [image1, image2, image3, image4].filter(img => img !== undefined);

        if (newImages.length > 0) {
            // Upload new images to Cloudinary
            const newImageUrls = await Promise.all(
                newImages.map(async (image) => {
                    const result = await cloudinary.uploader.upload(image.path, { resource_type: 'image' });
                    return result.secure_url;
                })
            );

            // Combine existing images with new ones
            product.image = [...product.image, ...newImageUrls];
        }

        await product.save();
        console.log('Product updated successfully:', product);
        res.json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }

// Get single product by ID
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, product });
    } catch (error) {
        console.error('Error getting product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products (with optional filters)
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.error('Error getting products:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { getProduct, getProducts, deleteProduct };