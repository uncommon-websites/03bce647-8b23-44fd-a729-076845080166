// Type definitions for Twitter/X widget
interface TwitterWidgets {
  createTweet(
    tweetId: string,
    targetEl: HTMLElement,
    options?: {
      theme?: "light" | "dark"
      align?: "left" | "center" | "right"
      dnt?: boolean
      [key: string]: any
    },
  ): Promise<HTMLElement>
  load(element?: HTMLElement): void
}

interface TwitterJS {
  widgets: TwitterWidgets
  ready(callback: Function): void
  _e: Function[]
  [key: string]: any
}

declare global {
  interface Window {
    twttr: TwitterJS
  }
}

export {}
