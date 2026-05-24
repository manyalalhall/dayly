import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import videoRoutes from './routes/videos.js'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use('/api/auth', limiter)

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
app.use('/uploads', express.static(uploadsDir))

app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err))

app.get('/', (req, res) => res.send('Day.ly backend is running'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))