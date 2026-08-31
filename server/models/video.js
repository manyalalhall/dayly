import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  src:       { type: String, required: true },
  tags:      [{ type: String }],
  creator:   { type: String, required: true },
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  likes:     { type: Number, default: 0 },
  views:     { type: Number, default: 0 },
  likedBy:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  pinnedBy:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  transcript:    { type: String, default: null },
  visualSummary: { type: String, default: null },
  aiStatus:      { type: String, enum: ['none', 'processing', 'done', 'failed'], default: 'none' },
}, { timestamps: true })

videoSchema.index({ title: 'text', tags: 'text', creator: 'text' })

export default mongoose.model('Video', videoSchema)