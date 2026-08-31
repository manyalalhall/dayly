import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const AI_SERVICE_URL = process.env.AI_SERVICE_URL
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY

if (!AI_SERVICE_URL || !INTERNAL_API_KEY) {
  console.warn(
    'AI_SERVICE_URL or INTERNAL_API_KEY is not set in server/.env — ' +
    'video transcript/summary requests will fail until both are configured.'
  )
}

/**
 * Sends an already-uploaded video to the internal AI service for
 * transcription + summarization.
 *
 * @param {string} videoSrc - the value stored on the Video doc, e.g. "/uploads/171234-clip.mp4"
 * @returns {Promise<{ transcript: string, visual_summary: string }>}
 */
export async function analyzeVideo(videoSrc) {
  const filename = path.basename(videoSrc)
  const absolutePath = path.join(__dirname, '..', 'uploads', filename)

  const fileBuffer = await fs.promises.readFile(absolutePath)
  const blob = new Blob([fileBuffer])

  const form = new FormData()
  form.append('file', blob, filename)

  const response = await fetch(`${AI_SERVICE_URL}/upload-video`, {
    method: 'POST',
    headers: { 'X-Internal-Api-Key': INTERNAL_API_KEY },
    body: form,
  })

  if (!response.ok) {
    // Log the real status/body server-side; callers only see a generic Error.
    const errBody = await response.text().catch(() => '')
    console.error(`AI service returned ${response.status}: ${errBody}`)
    throw new Error(`AI service request failed with status ${response.status}`)
  }

  return response.json()
}