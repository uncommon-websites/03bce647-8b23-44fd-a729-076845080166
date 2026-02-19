declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface Platform {}
  }

  interface Window {
    twttr?: {
      widgets?: {
        createTweet: (
          id: string,
          target: HTMLElement,
          options?: {
            theme?: 'light' | 'dark'
            dnt?: boolean
            align?: 'left' | 'center' | 'right'
          },
        ) => Promise<HTMLElement>
      }
    }
  }
}

export {}
