import { env } from '$env/dynamic/private'
import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, fetch }) => {
  try {
    let body: { inquiry?: string; contact?: string }

    try {
      body = await request.json()
    } catch (error) {
      console.error('Error parsing request body:', error)
      return json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { inquiry, contact } = body

    if (!inquiry || !contact) {
      return json({ error: 'Missing required fields' }, { status: 400 })
    }

    const webhookUrls = [
      env.SLACK_WEBHOOK_URL,
      env.SLACK_WEBHOOK_URL_2,
    ].filter((webhookUrl): webhookUrl is string => Boolean(webhookUrl))

    console.log('[svelte] Webhook URLs configured:', webhookUrls.length)
    console.log('[svelte] Second webhook set:', Boolean(env.SLACK_WEBHOOK_URL_2))

    const message = {
      text: `*${contact}* wants you to *${inquiry}*`,
      mrkdwn: true,
    }

    try {
      const responses = await Promise.all(
        webhookUrls.map((webhookUrl) =>
          fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
          }),
        ),
      )

      responses.forEach((response, index) => {
        if (response.ok) {
          console.log(`[svelte] Slack webhook ${index + 1} sent successfully`)
        } else {
          console.error(`[svelte] Slack webhook ${index + 1} error:`, response.status)
        }
      })

      return json({ success: true })
    } catch (error) {
      console.error('Error sending to Slack:', error)
      return json({ success: true })
    }
  } catch (error) {
    console.error('Error in notify API:', error)
    return json({ success: true })
  }
}
