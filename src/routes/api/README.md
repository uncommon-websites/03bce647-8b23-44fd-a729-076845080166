# Slack Webhook Integration Setup

This API implements Slack webhook integrations for tracking visitor activity and contact form submissions.

## Environment Variables

Add these environment variables to your `.env` file:

```bash
# Required: Primary Slack webhook URL for tracking notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# Optional: Secondary Slack webhook URL (only used for contact form notifications)
SLACK_WEBHOOK_URL_2=https://hooks.slack.com/services/YOUR/SECOND/WEBHOOK/URL
```

## API Routes

### `/api/track` (POST)
Real-time visitor tracking notifications sent to Slack.

**Request Body:**
```json
{
  "eventType": "pageview" | "click" | "mercor_click",
  "data": {
    "country": "string",
    "city": "string",
    "region": "string",
    "browser": "string",
    "referrer": "string",
    "element": "string",
    "inputValue": "string"
  }
}
```

**Slack Message Formats:**
- `pageview`: `*{country} ({city}, {browser})* visited *Homepage* via *{referrer}*.`
- `click` (submit): `*{country} ({city}, {browser})* clicked on *submit*: "{inputValue}".`
- `click` (general): `*{country} ({city}, {browser})* clicked on *{element}*.`
- `mercor_click`: `*{country} ({city}, {browser})* clicked on *Mercor*.`

**Response:**
```json
{ "success": true }
```

### `/api/notify` (POST)
Contact form submission notifications sent to both webhook URLs.

**Request Body:**
```json
{
  "inquiry": "string",
  "contact": "string"
}
```

**Slack Message Format:**
`*{contact}* wants you to *{inquiry}*`

**Response:**
```json
{ "success": true }
```

## Client-Side Tracking

The client automatically tracks:
- **Page views** with browser detection, geolocation, and referrer source
- **Company link clicks** with specific tracking for Mercor
- **Form submissions** with input values included

### Browser Detection
Detects: Chrome, Firefox, Safari, Edge

### Referrer Sources
Recognizes: Twitter, Facebook, LinkedIn, Instagram, Google, or domain name

### Geolocation
Uses `https://ipapi.co/json/` to fetch: country, city, region, IP address

## Error Handling

Both API routes:
- Validate required fields
- Safely parse JSON bodies with try/catch
- Return `{ success: true }` even on Slack failures (prevents client UX disruption)
- Never expose internal errors to the client
- Log errors to console for debugging

## Security Notes

- Environment variables are accessed via `$env/dynamic/private` (server-side only)
- Webhook URLs are never exposed to the client
- All tracking is done via server-side API routes
- Client errors are caught and logged without disrupting user experience
