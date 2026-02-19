import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Safely parse the request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("Error parsing request body:", error)
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { inquiry, contact } = body

    // Validate required fields
    if (!inquiry || !contact) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const webhookUrls = [
      process.env.SLACK_WEBHOOK_URL,
      process.env.SLACK_WEBHOOK_URL_2, // Second webhook from environment variable
    ].filter(Boolean) // Remove undefined values if env var not set

    console.log("[v0] Webhook URLs configured:", webhookUrls.length)
    console.log("[v0] Second webhook set:", !!process.env.SLACK_WEBHOOK_URL_2)

    const message = {
      text: `*${contact}* wants you to *${inquiry}*`,
      mrkdwn: true,
    }

    try {
      const promises = webhookUrls.map((webhookUrl) =>
        fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        }),
      )

      const responses = await Promise.all(promises)

      responses.forEach((response, index) => {
        if (response.ok) {
          console.log(`[v0] Slack webhook ${index + 1} sent successfully`)
        } else {
          console.error(`Slack webhook ${index + 1} error:`, response.status)
        }
      })

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error sending to Slack:", error)
      // Return success anyway to prevent client-side errors
      // This ensures the user experience isn't disrupted even if Slack fails
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("Error in notify API:", error)
    // Return success to client even if there's an internal error
    // This prevents the client-side application from crashing
    return NextResponse.json({ success: true })
  }
}
