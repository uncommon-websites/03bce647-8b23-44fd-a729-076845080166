<script lang="ts">
  import { onMount } from 'svelte'
  import { loadTwitterWidgets } from '$lib/twitter'

  const tweetUrls = [
    'https://x.com/thilokonzok/status/1887807734524834138',
    'https://x.com/thilokonzok/status/1905558756043174366',
    'https://x.com/thilokonzok/status/1897233132090470875',
    'https://x.com/thilokonzok/status/1856967828315701357',
  ]

  const tweetIds = tweetUrls.map((url) => url.split('/').at(-1) ?? '')
  let tweetRefs: Array<HTMLDivElement | null> = []

  onMount(() => {
    const observers: IntersectionObserver[] = []

    const setupObservers = () => {
      tweetRefs.forEach((ref) => {
        if (!ref) {
          return
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.remove('opacity-0', 'blur-md', 'translate-y-8')
                entry.target.classList.add('opacity-100', 'blur-0', 'translate-y-0')
              } else {
                entry.target.classList.remove('opacity-100', 'blur-0', 'translate-y-0')
                entry.target.classList.add('opacity-0', 'blur-md', 'translate-y-8')
              }
            })
          },
          {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
          },
        )

        observer.observe(ref)
        observers.push(observer)
      })
    }

    const renderTweets = async () => {
      const twttr = await loadTwitterWidgets()
      const widgets = twttr?.widgets

      if (!widgets) {
        return
      }

      tweetIds.forEach((id, index) => {
        const container = tweetRefs[index]

        if (!container) {
          return
        }

        container.innerHTML = ''

        void widgets.createTweet(id, container, {
          theme: 'light',
          dnt: true,
          align: 'center',
        })
      })
    }

    void renderTweets().then(setupObservers)

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  })
</script>

<svelte:head>
  <title>Posts - Thilo Konzok</title>
</svelte:head>

<main class="min-h-screen bg-white">
  <div class="container mx-auto px-8 pt-24 pb-16">
    <div class="space-y-12">
      {#each tweetIds as id, index (id)}
        <div
          bind:this={tweetRefs[index]}
          class="transition-all duration-700 ease-in-out opacity-0 blur-md translate-y-8 max-w-xl mx-auto"
          data-tweet-id={id}
        ></div>
      {/each}
    </div>
  </div>
</main>
