import express from 'express'
import multer from 'multer'
import path from 'path'
import jwt from 'jsonwebtoken'
import { fileURLToPath } from 'url'
import Video from '../models/video.js'
import { analyzeVideo } from '../lib/aiService.js'

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

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('video/')
      ? cb(null, true)
      : cb(new Error('Only video files allowed'), false)
  }
})

router.get('/', async (req, res) => {
  try {
    const { q, creator } = req.query
    let filter = {}
    if (q) filter.$text = { $search: q }
    if (creator) filter.creator = creator
    const videos = await Video.find(filter).sort({ createdAt: -1 }).limit(50)
    res.json(videos)
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

router.post('/', auth, upload.single('video'), async (req, res) => {
  try {
    const { title, tags } = req.body
    if (!req.file) return res.status(400).json({ message: 'No video file' })
    const video = new Video({
      title,
      src: `/uploads/${req.file.filename}`,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      creator: req.user.username,
      creatorId: req.user.userId,
    })
    await video.save()
    res.status(201).json(video)
  } catch (err) {
    res.status(500).json({ message: 'Upload failed' })
  }
})

router.post('/:id/like', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return res.status(404).json({ message: 'Not found' })
    const idx = video.likedBy.indexOf(req.user.userId)
    if (idx === -1) { video.likedBy.push(req.user.userId); video.likes++ }
    else            { video.likedBy.splice(idx, 1);        video.likes-- }
    await video.save()
    res.json({ likes: video.likes, liked: idx === -1 })
  } catch {
    res.status(500).json({ message: 'Error' })
  }
})

router.post('/:id/view', async (req, res) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } })
    res.json({ ok: true })
  } catch {
    res.status(500).json({ message: 'Error' })
  }
})

router.post('/:id/pin', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return res.status(404).json({ message: 'Not found' })
    const idx = video.pinnedBy.indexOf(req.user.userId)
    if (idx === -1) video.pinnedBy.push(req.user.userId)
    else video.pinnedBy.splice(idx, 1)
    await video.save()
    res.json({ pinned: idx === -1 })
  } catch {
    res.status(500).json({ message: 'Error' })
  }
})

// On-demand transcript + visual summary. Requires login, since each new
// analysis triggers real compute cost (Whisper + BLIP) on the AI service.
router.post('/:id/analyze', auth, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
    if (!video) return res.status(404).json({ message: 'Not found' })

    if (video.aiStatus === 'done') {
      return res.json({
        status: 'done',
        transcript: video.transcript,
        visualSummary: video.visualSummary,
      })
    }

    if (video.aiStatus === 'processing') {
      return res.status(409).json({ status: 'processing', message: 'Analysis already in progress' })
    }

    video.aiStatus = 'processing'
    await video.save()

    try {
      const result = await analyzeVideo(video.src)
      video.transcript = result.transcript
      video.visualSummary = result.visual_summary
      video.aiStatus = 'done'
      await video.save()
      res.json({ status: 'done', transcript: video.transcript, visualSummary: video.visualSummary })
    } catch (err) {
      console.error('Video analysis failed:', err)
      video.aiStatus = 'failed'
      await video.save()
      res.status(502).json({ status: 'failed', message: 'Analysis failed, please try again' })
    }
  } catch {
    res.status(500).json({ message: 'Server error' })
  }
})

export default router