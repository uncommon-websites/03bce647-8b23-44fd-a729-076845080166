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

    const { eventType, data } = body

    // Validate required fields
    if (!eventType || !data) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Slack webhook URL - using the same one as in notify API
    const webhookUrl = process.env.SLACK_WEBHOOK_URL || ""

    // Format message based on event type - using Slack's markdown formatting
    let message = ""
    if (eventType === "pageview") {
      // Include referrer information if available
      const referrerInfo = data.referrer && data.referrer !== "direct" ? ` via *${data.referrer}*` : ""

      message = `*${data.country || "Unknown"} (${data.region || "Unknown"}, ${data.browser?.split(" ")[0] || "Unknown"})* visited *Homepage*${referrerInfo}.`
    } else if (eventType === "click" && data.element === "submit") {
      // Special handling for submit button clicks
      message = `*${data.country || "Unknown"} (${data.region || "Unknown"}, ${data.browser?.split(" ")[0] || "Unknown"})* clicked on *submit*: "${data.inputValue || "empty"}".`
    } else if (eventType === "click") {
      message = `*${data.country || "Unknown"} (${data.region || "Unknown"}, ${data.browser?.split(" ")[0] || "Unknown"})* clicked on *${data.element || "Unknown"}*.`
    } else if (eventType === "mercor_click") {
      message = `*${data.country || "Unknown"} (${data.region || "Unknown"}, ${data.browser?.split(" ")[0] || "Unknown"})* clicked on *Mercor*.`
    }

    // Send to Slack with formatted message
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: message,
          mrkdwn: true,
        }),
      })

      if (!response.ok) {
        console.error("Slack API error:", await response.text())
        throw new Error(`Failed to send to Slack: ${response.status}`)
      }

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error("Error sending to Slack:", error)
      // Return success anyway to prevent client-side errors
      return NextResponse.json({ success: true })
    }
  } catch (error) {
    console.error("Error in track API:", error)
    // Return success to client even if there's an internal error
    return NextResponse.json({ success: true })
  }
}
