import express from 'express'
import { listProducts, addProduct, removeProduct, singleProduct, getProduct, getProducts, updateProduct, deleteProduct } from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

// Specific routes first
productRouter.post('/add', adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), addProduct);
productRouter.post('/remove', adminAuth, removeProduct);
productRouter.post('/single', singleProduct);
productRouter.get('/list', listProducts);

// Update route before ID-based routes
productRouter.put('/update/:id', adminAuth, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]), updateProduct);

// ID-based routes last
productRouter.get('/:id', getProduct);
productRouter.get('/', getProducts);
productRouter.delete('/:id', adminAuth, deleteProduct);

export default productRouter