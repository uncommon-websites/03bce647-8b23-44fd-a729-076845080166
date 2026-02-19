"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Script from "next/script"

// List of tweet URLs
const tweetUrls = [
  "https://x.com/thilokonzok/status/1887807734524834138",
  "https://x.com/thilokonzok/status/1905558756043174366",
  "https://x.com/thilokonzok/status/1897233132090470875",
  "https://x.com/thilokonzok/status/1856967828315701357",
]

export default function Posts() {
  const [tweetIds, setTweetIds] = useState<string[]>([])
  const observerRefs = useRef<IntersectionObserver[]>([])
  const tweetRefs = useRef<(HTMLDivElement | null)[]>([])

  // Extract tweet IDs from URLs
  useEffect(() => {
    const ids = tweetUrls.map((url) => {
      const parts = url.split("/")
      return parts[parts.length - 1]
    })
    setTweetIds(ids)
  }, [])

  // Load Twitter widget script
  useEffect(() => {
    // Only load if we have tweet IDs and window.twttr is not defined
    if (tweetIds.length > 0 && !window.twttr) {
      const script = document.createElement("script")
      script.src = "https://platform.twitter.com/widgets.js"
      script.async = true
      script.charset = "utf-8"
      document.body.appendChild(script)

      return () => {
        document.body.removeChild(script)
      }
    }
  }, [tweetIds])

  // Initialize tweets when Twitter widget is loaded
  useEffect(() => {
    if (tweetIds.length === 0) return

    // Function to render tweets
    const renderTweets = () => {
      if (window.twttr && window.twttr.widgets) {
        tweetIds.forEach((id, index) => {
          const tweetContainer = tweetRefs.current[index]
          if (tweetContainer) {
            // Clear previous content
            tweetContainer.innerHTML = ""

            // Create tweet embed
            window.twttr.widgets.createTweet(id, tweetContainer, {
              theme: "light",
              dnt: true,
              align: "center",
            })
          }
        })
      }
    }

    // Check if Twitter widget is already loaded
    if (window.twttr && window.twttr.widgets) {
      renderTweets()
    } else {
      // Wait for Twitter widget to load
      const checkTwttr = setInterval(() => {
        if (window.twttr && window.twttr.widgets) {
          clearInterval(checkTwttr)
          renderTweets()
        }
      }, 100)

      return () => clearInterval(checkTwttr)
    }
  }, [tweetIds])

  // Set up intersection observers for fade effects
  useEffect(() => {
    // Clean up previous observers
    observerRefs.current.forEach((observer) => observer.disconnect())
    observerRefs.current = []

    tweetRefs.current.forEach((ref, index) => {
      if (!ref) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Fade in when tweet enters viewport
              entry.target.classList.remove("opacity-0", "blur-md", "translate-y-8")
              entry.target.classList.add("opacity-100", "blur-0", "translate-y-0")
            } else {
              // Fade out when tweet leaves viewport
              entry.target.classList.remove("opacity-100", "blur-0", "translate-y-0")
              entry.target.classList.add("opacity-0", "blur-md", "translate-y-8")
            }
          })
        },
        {
          root: null,
          rootMargin: "0px",
          threshold: 0.1,
        },
      )

      observer.observe(ref)
      observerRefs.current.push(observer)
    })

    return () => {
      observerRefs.current.forEach((observer) => observer.disconnect())
    }
  }, [tweetIds])

  return (
    <main className="min-h-screen bg-white">
      <Head>
        <title>Posts - Thilo Konzok</title>
      </Head>

      {/* Twitter widget script */}
      <Script
        id="twitter-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.twttr = (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0],
                t = window.twttr || {};
              if (d.getElementById(id)) return t;
              js = d.createElement(s);
              js.id = id;
              js.src = "https://platform.twitter.com/widgets.js";
              fjs.parentNode.insertBefore(js, fjs);
              t._e = [];
              t.ready = function(f) {
                t._e.push(f);
              };
              return t;
            }(document, "script", "twitter-wjs"));
          `,
        }}
      />

      <div className="container mx-auto px-8 pt-24 pb-16">
        <div className="space-y-12">
          {tweetIds.map((id, index) => (
            <div
              key={id}
              ref={(el) => (tweetRefs.current[index] = el)}
              className="transition-all duration-700 ease-in-out opacity-0 blur-md translate-y-8 max-w-xl mx-auto"
              data-tweet-id={id}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
