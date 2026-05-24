import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET

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
  } catch {
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
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router