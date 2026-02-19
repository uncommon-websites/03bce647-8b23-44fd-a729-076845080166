"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Script from "next/script"

export default function Designer() {
  const tweetRef = useRef<HTMLDivElement>(null)

  // Original content for SEO (hidden from users)
  const seoContent = `
    how to hire a founding designer:
    1. hire a right hand to the ceo that happens to design: good designers expand into product, great designers expand into business.
    2. hire young, it allows for exceptionalism and controls for ego. find someone you'd invest in as ceo of their own company 3 years from now so they can't be too old or they would be doing that already. a quiet ego makes sure they don't design to impress other designers but to impress your customers.
    3. x is a good filter. if you are young and are ambitious you'll go to where your peers are. find 5 designers you love, export who they follow with fedica and filter by bio and location. great designers follow each other, which does 90% of the selection for you.
    4. if their portfolio is sub 8/10, don't interview: if they are not great at selling themselves, they won't be great at selling your company to customers. you'll interview max 3-5 as you can filter out 95% before, its very different to engineers (where selling themselves well online might be a negative signal).
    5. you checked for quality, now check for speed: give them a way too large task with no expectations on timeline, just tell them to take it wherever they want to as long as its impressive. you want to see time-adjusted greatness: someone sending you a good first draft 1h after your interview or a truly great result after the weekend.
    6. overpay them but hold them to almost too high standards: if you picked right they will be trajectory changing, so even 2x comp (equity) is likely still underpaying them (and they otherwise just leave to start their own thing to get paid market eventually). if they aren't, keep looking.
  `

  // Initialize tweet when Twitter widget is loaded
  useEffect(() => {
    // Function to render tweet
    const renderTweet = () => {
      if (window.twttr && window.twttr.widgets && tweetRef.current) {
        // Clear previous content
        tweetRef.current.innerHTML = ""

        // Create tweet embed
        window.twttr.widgets.createTweet("1887807734524834138", tweetRef.current, {
          theme: "light",
          dnt: true,
          align: "center",
        })
      }
    }

    // Check if Twitter widget is already loaded
    if (window.twttr && window.twttr.widgets) {
      renderTweet()
    } else {
      // Wait for Twitter widget to load
      const checkTwttr = setInterval(() => {
        if (window.twttr && window.twttr.widgets) {
          clearInterval(checkTwttr)
          renderTweet()
        }
      }, 100)

      return () => clearInterval(checkTwttr)
    }
  }, [])

  return (
    <main className="min-h-screen bg-white flex flex-col">
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

      {/* Back button */}
      <div className="container mx-auto px-8 pt-8">
        <Link href="/" className="inline-flex items-center text-[#7C7C7C] hover:text-[#FF4500] transition-colors">
          <ArrowLeft size={18} />
        </Link>
      </div>

      {/* Hidden SEO content */}
      <div className="sr-only" aria-hidden="true">
        {seoContent}
      </div>

      {/* Twitter embed with scaling */}
      <div className="flex-grow flex items-center justify-center pt-8">
        <div className="container mx-auto px-8 max-w-xl">
          <div
            ref={tweetRef}
            className="flex justify-center"
            style={{
              transform: "scale(0.7)",
              transformOrigin: "center top",
              marginBottom: "-15%", // Compensate for the scaling to avoid extra whitespace
            }}
          />
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-24"></div>
    </main>
  )
}
