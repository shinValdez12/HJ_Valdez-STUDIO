import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

import { contact } from "@/lib/data"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    // Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      )
    }

    // Check for environment variables
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com"
    const smtpPort = parseInt(process.env.SMTP_PORT || "587")

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP credentials not configured. Email will not be sent.")
      // In development, log the message instead
      console.log("Contact form submission:", { name, email, message })
      return NextResponse.json({ 
        success: true, 
        message: "Message received (email sending not configured)" 
      })
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    // Send email
    await transporter.sendMail({
      from: smtpUser,
      to: contact.email,
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      border-bottom: 2px solid #0a0a0a;
      padding-bottom: 20px;
      margin-bottom: 20px;
    }
    .field {
      margin-bottom: 16px;
    }
    .label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #666;
    }
    .value {
      font-size: 16px;
      color: #0a0a0a;
    }
    .message {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 4px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-weight: normal;">New Contact Form Submission</h1>
    </div>
    <div class="field">
      <p class="label">Name</p>
      <p class="value">${name}</p>
    </div>
    <div class="field">
      <p class="label">Email</p>
      <p class="value"><a href="mailto:${email}">${email}</a></p>
    </div>
    <div class="field">
      <p class="label">Message</p>
      <div class="message">${message.replace(/\n/g, "<br>")}</div>
    </div>
  </div>
</body>
</html>
      `,
    })

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    )
  }
}
