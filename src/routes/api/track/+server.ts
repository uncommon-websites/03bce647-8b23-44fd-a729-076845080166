import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    let body: { eventType?: string; data?: Record<string, string> }

    try {
      body = await request.json()
    } catch (error) {
      console.error('Error parsing request body:', error)
      return json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { eventType, data } = body

    if (!eventType || !data) {
      return json({ error: 'Missing required fields' }, { status: 400 })
    }

    let message = ''

    if (eventType === 'pageview') {
      const referrerInfo = data.referrer && data.referrer !== 'direct' ? ` via *${data.referrer}*` : ''
      message = `*${data.country || 'Unknown'} (${data.region || 'Unknown'}, ${data.browser?.split(' ')[0] || 'Unknown'})* visited *Homepage*${referrerInfo}.`
    } else if (eventType === 'click' && data.element === 'submit') {
      message = `*${data.country || 'Unknown'} (${data.region || 'Unknown'}, ${data.browser?.split(' ')[0] || 'Unknown'})* clicked on *submit*: "${data.inputValue || 'empty'}".`
    } else if (eventType === 'click') {
      message = `*${data.country || 'Unknown'} (${data.region || 'Unknown'}, ${data.browser?.split(' ')[0] || 'Unknown'})* clicked on *${data.element || 'Unknown'}*.`
    } else if (eventType === 'mercor_click') {
      message = `*${data.country || 'Unknown'} (${data.region || 'Unknown'}, ${data.browser?.split(' ')[0] || 'Unknown'})* clicked on *Mercor*.`
    }

    const webhookUrl = env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return json({ success: true })
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          mrkdwn: true,
        }),
      })

      if (!response.ok) {
        console.error('Slack API error:', await response.text())
        throw new Error(`Failed to send to Slack: ${response.status}`)
      }

      return json({ success: true })
    } catch (error) {
      console.error('Error sending to Slack:', error)
      return json({ success: true })
    }
  } catch (error) {
    console.error('Error in track API:', error)
    return json({ success: true })
  }
}
