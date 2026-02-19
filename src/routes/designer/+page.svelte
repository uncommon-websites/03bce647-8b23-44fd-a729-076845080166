<script lang="ts">
  import { onMount } from 'svelte'
  import { loadTwitterWidgets } from '$lib/twitter'

  let tweetRef: HTMLDivElement | null = null

  const seoContent = `
    how to hire a founding designer:
    1. hire a right hand to the ceo that happens to design: good designers expand into product, great designers expand into business.
    2. hire young, it allows for exceptionalism and controls for ego. find someone you'd invest in as ceo of their own company 3 years from now so they can't be too old or they would be doing that already. a quiet ego makes sure they don't design to impress other designers but to impress your customers.
    3. x is a good filter. if you are young and are ambitious you'll go to where your peers are. find 5 designers you love, export who they follow with fedica and filter by bio and location. great designers follow each other, which does 90% of the selection for you.
    4. if their portfolio is sub 8/10, don't interview: if they are not great at selling themselves, they won't be great at selling your company to customers. you'll interview max 3-5 as you can filter out 95% before, its very different to engineers (where selling themselves well online might be a negative signal).
    5. you checked for quality, now check for speed: give them a way too large task with no expectations on timeline, just tell them to take it wherever they want to as long as its impressive. you want to see time-adjusted greatness: someone sending you a good first draft 1h after your interview or a truly great result after the weekend.
    6. overpay them but hold them to almost too high standards: if you picked right they will be trajectory changing, so even 2x comp (equity) is likely still underpaying them (and they otherwise just leave to start their own thing to get paid market eventually). if they aren't, keep looking.
  `

  onMount(() => {
    let cancelled = false

    const renderTweet = async () => {
      const twttr = await loadTwitterWidgets()

      if (!cancelled && twttr?.widgets && tweetRef) {
        tweetRef.innerHTML = ''
        void twttr.widgets.createTweet('1887807734524834138', tweetRef, {
          theme: 'light',
          dnt: true,
          align: 'center',
        })
      }
    }

    void renderTweet()

    return () => {
      cancelled = true
    }
  })
</script>

<main class="min-h-screen bg-white flex flex-col">
  <div class="container mx-auto px-8 pt-8">
    <a href="/" class="inline-flex items-center text-[#7C7C7C] hover:text-[#FF4500] transition-colors" aria-label="Back">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
    </a>
  </div>

  <div class="sr-only" aria-hidden="true">{seoContent}</div>

  <div class="flex-grow flex items-center justify-center pt-8">
    <div class="container mx-auto px-8 max-w-xl">
      <div
        bind:this={tweetRef}
        class="flex justify-center"
        style="transform: scale(0.7); transform-origin: center top; margin-bottom: -15%;"
      ></div>
    </div>
  </div>

  <div class="h-24"></div>
</main>
