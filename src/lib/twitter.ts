export async function loadTwitterWidgets() {
  if (typeof window === 'undefined') {
    return null
  }

  if (window.twttr?.widgets) {
    return window.twttr
  }

  if (!document.getElementById('twitter-wjs')) {
    const script = document.createElement('script')
    script.id = 'twitter-wjs'
    script.src = 'https://platform.twitter.com/widgets.js'
    script.async = true
    script.charset = 'utf-8'
    document.body.appendChild(script)
  }

  await new Promise<void>((resolve) => {
    const checkLoaded = () => {
      if (window.twttr?.widgets) {
        resolve()
        return
      }

      window.setTimeout(checkLoaded, 100)
    }

    checkLoaded()
  })

  return window.twttr ?? null
}
