import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import User from '../models/user.js'
import Video from '../models/video.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ message: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)
    await new User({ username, email, password: hashed }).save()
    res.status(201).json({ message: 'Account created successfully' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'No account found with this email' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password' })

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Login successful', username: user.username, token, userId: user._id })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/delete', auth, async (req, res) => {
  try {
    const { userId } = req.user
    const videos = await Video.find({ creatorId: userId })
    for (const video of videos) {
      const filePath = path.join(__dirname, '..', video.src)
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
    }
    await Video.deleteMany({ creatorId: userId })
    await User.findByIdAndDelete(userId)
    res.json({ message: 'Account deleted' })
  } catch (err) {
    console.error('Delete error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router