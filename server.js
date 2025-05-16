import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import { updateProduct, sendEmail } from './controllers/productController.js'
import orderRouter from './routes/orderRoute.js'
import subscriptionRouter from './routes/subscriptionRoute.js'

// App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))




// Routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/subscription', subscriptionRouter)

app.get('/',(req,res)=>{
    res.send("API Working")
})

app.post('/api/product/update',updateProduct)
app.post('/sendemail', sendEmail)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Something broke!' })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})