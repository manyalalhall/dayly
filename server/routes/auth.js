import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import User from '../models/user.js'
import Video from '../models/video.js'
import { sendVerificationEmail } from '../lib/email.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'No token' })
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body
    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields required' })

    const existing = await User.findOne({ email })
    if (existing)
      return res.status(400).json({ message: 'Email already in use' })

    const hashed = await bcrypt.hash(password, 10)
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    await new User({ username, email, password: hashed, verifyToken, verifyTokenExpiry }).save()
    await sendVerificationEmail(email, username, verifyToken)

    res.status(201).json({ message: 'Account created! Please check your email to verify your account.' })
  } catch (err) {
    console.error('Signup error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// VERIFY EMAIL
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query
    if (!token) return res.status(400).json({ message: 'Missing token' })

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: new Date() }
    })

    if (!user)
      return res.status(400).json({ message: 'Invalid or expired verification link' })

    user.verified = true
    user.verifyToken = undefined
    user.verifyTokenExpiry = undefined
    await user.save()

    // Redirect to frontend with success flag
    res.redirect(`${process.env.FRONTEND_URL}/?verified=true`)
  } catch (err) {
    console.error('Verify error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user)
      return res.status(400).json({ message: 'No account found with this email' })

    if (!user.verified)
      return res.status(403).json({ message: 'Please verify your email before logging in. Check your inbox.' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(400).json({ message: 'Incorrect password' })

    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ message: 'Login successful', username: user.username, token, userId: user._id })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE ACCOUNT
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