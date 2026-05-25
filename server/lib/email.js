import { Resend } from 'resend'

export async function sendVerificationEmail(toEmail, username, token) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
  const verifyUrl = `${backendUrl}/api/auth/verify?token=${token}`

  console.log('Sending verification email to:', toEmail)
  console.log('Verify URL:', verifyUrl)
  console.log('From:', process.env.EMAIL_FROM)

  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Verify your Day.ly account',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
        <h2 style="font-size: 24px; margin-bottom: 8px;">Welcome to Day.ly, @${username}!</h2>
        <p style="color: #555; line-height: 1.6; margin-bottom: 28px;">
          Click the button below to verify your email address. This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}"
          style="display: inline-block; background: #e63946; color: white;
                 padding: 12px 28px; border-radius: 999px; text-decoration: none;
                 font-weight: 600; font-size: 15px;">
          Verify my account
        </a>
        <p style="color: #aaa; font-size: 12px; margin-top: 32px;">
          If you didn't create a Day.ly account, you can safely ignore this email.
        </p>
      </div>
    `
  })
  console.log('Resend result:', JSON.stringify(result))
}