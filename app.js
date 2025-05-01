import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()


// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

import authRoutes from './routes/authRouter.js'

// Parent Routes
app.get('/', (req, res) => {
  res.send('This Index M*therF*cker')
})
app.use('/api/auth', authRoutes)


app.use(notFound)
app.use(errorHandler)

// Connect to MongoDB

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}) 


mongoose.connect(process.env.DATABASE_URL, {

}).then(() => {
  console.log('MongoDB Connected')
})

