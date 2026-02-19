import { redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
  throw redirect(301, 'https://us05web.zoom.us/j/6192499270?pwd=aUtNb0hGZmt5eUUwS3BPdmNjOVhtZz09')
}
