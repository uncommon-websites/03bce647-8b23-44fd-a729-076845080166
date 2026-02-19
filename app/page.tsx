"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Custom error boundary component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
      <button onClick={resetErrorBoundary} className="px-4 py-2 bg-[#FF4500] text-white rounded-full">
        Try again
      </button>
    </div>
  )
}

// Define types for company data
interface Company {
  name: string
  url: string
  displayName: string
}

// Define type for multi-word company data
interface MultiWordCompany {
  words: string[]
  url: string
}

export default function Home() {
  const [visibleSentence, setVisibleSentence] = useState<number>(0)
  const [visibleWords, setVisibleWords] = useState<number[]>([0, 0, 0])
  const [currentStep, setCurrentStep] = useState<"initial" | "contact" | "thanks">("initial")
  const [userInput, setUserInput] = useState<string>("")
  const [savedInquiry, setSavedInquiry] = useState<string>("")
  const [contactInfo, setContactInfo] = useState<string>("")
  const [currentSuggestion, setCurrentSuggestion] = useState<number>(0)
  const [suggestionVisibleWords, setSuggestionVisibleWords] = useState<number>(0)
  const [isAnimatingSuggestion, setIsAnimatingSuggestion] = useState<boolean>(true)
  const [suggestionBlur, setSuggestionBlur] = useState<number>(0)
  const [contactVisibleWords, setContactVisibleWords] = useState<number>(0)
  const [thanksVisibleWords, setThanksVisibleWords] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [userInfo, setUserInfo] = useState<any>({})

  // Split the bio into sentences
  const firstSentence = "Thilo is Uncommon Founder, Partner and Sequoia Arc Advisor."
  const secondSentence =
    "He invested, advised or designed Mercor, Delphi, Squint, Dash0, CrewAI, GradientLabs, Build, Fleet, Medra, nsave, Ironbridge, DiligenceSquared, Lemni, Morphic, Compile, Lapel, Orbit, Sensmore, Nolla, Luo, Hero, Popcorn, Partykit, GuidedEnergy, CommerceSystems, Claim, Structify, Snaptrude, Superlinked, Tilebox, Amperecloud, Equipme, Documenso and Era, founded Home, worked at Airbnb in 2011 and studied architecture – DM anytime on X or LinkedIn."
  const thirdSentence = "How can we work together?"
  const contactMessage = "What's your Linkedin?"
  const thanksMessage = "I'm looking forward to meeting you."

  // Safely split sentences into words with error handling
  const safeStringSplit = (str: string | undefined): string[] => {
    if (typeof str === "string") {
      return str.split(/\s+/)
    }
    return []
  }

  // Split each sentence into words
  const firstSentenceWords = safeStringSplit(firstSentence)
  const secondSentenceWords = safeStringSplit(secondSentence)
  const thirdSentenceWords = safeStringSplit(thirdSentence)
  const sentences = [firstSentenceWords, secondSentenceWords, thirdSentenceWords]

  const contactWords = safeStringSplit(contactMessage)
  const thanksWords = safeStringSplit(thanksMessage)

  // Company names and their URLs
  const companies: Company[] = [
    { name: "Uncommon", url: "https://www.unc.mn/", displayName: "Uncommon" },
    { name: "Sequoia", url: "https://www.sequoiacap.com", displayName: "Sequoia" },
    { name: "Mercor", url: "https://mercor.com/", displayName: "Mercor" },
    { name: "Delphi", url: "https://www.delphi.gg", displayName: "Delphi" },
    { name: "Squint", url: "https://www.squint.ai/", displayName: "Squint" },
    { name: "Dash0", url: "http://dash0.com/", displayName: "Dash0" },
    { name: "CrewAI", url: "https://www.crewai.com/", displayName: "CrewAI" },
    { name: "GradientLabs", url: "https://gradient-labs.ai/", displayName: "GradientLabs" },
    { name: "Build", url: "https://www.build.inc/", displayName: "Build" },
    { name: "Fleet", url: "https://www.fleet.so/", displayName: "Fleet" },
    { name: "Medra", url: "https://www.medralabs.com/", displayName: "Medra" },
    { name: "nsave", url: "https://www.nsave.com/", displayName: "nsave" },
    { name: "Ironbridge", url: "https://ironbridgesp.com", displayName: "Ironbridge" },
    { name: "DiligenceSquared", url: "https://www.diligencesquared.com", displayName: "DiligenceSquared" },
    { name: "Lemni", url: "https://www.lemni.com/", displayName: "Lemni" },
    { name: "Morphic", url: "https://www.morphic.com/", displayName: "Morphic" },
    { name: "Compile", url: "https://compilelabs.ai/", displayName: "Compile" },
    { name: "Lapel", url: "https://lapel.com/", displayName: "Lapel" },
    { name: "Orbit", url: "https://www.orbit.engineering/", displayName: "Orbit" },
    { name: "Sensmore", url: "http://sensmore.ai/", displayName: "Sensmore" },
    { name: "Nolla", url: "https://www.nollahealth.com/", displayName: "Nolla" },
    { name: "Luo", url: "https://www.luopay.co/", displayName: "Luo" },
    { name: "Hero", url: "https://herostuff.com/", displayName: "Hero" },
    { name: "Popcorn", url: "https://popcorn.space/", displayName: "Popcorn" },
    { name: "Partykit", url: "http://partykit.io", displayName: "Partykit" },
    { name: "GuidedEnergy", url: "https://guided.energy/", displayName: "Guided Energy" },
    { name: "CommerceSystems", url: "https://commercesystems.com/", displayName: "Commerce Systems" },
    { name: "Claim", url: "https://www.claim.co", displayName: "Claim" },
    { name: "Structify", url: "https://structify.ai/", displayName: "Structify" },
    { name: "Snaptrude", url: "https://www.snaptrude.com/", displayName: "Snaptrude" },
    { name: "Superlinked", url: "https://superlinked.com/", displayName: "Superlinked" },
    { name: "Tilebox", url: "https://tilebox.io/", displayName: "Tilebox" },
    { name: "Amperecloud", url: "https://www.amperecloud.com/", displayName: "Amperecloud" },
    { name: "Equipme", url: "https://equipme.io", displayName: "Equipme" },
    { name: "Documenso", url: "https://documenso.com/", displayName: "Documenso" },
    { name: "Era", url: "https://era.app/", displayName: "Era" },
    { name: "Airbnb", url: "https://www.airbnb.com", displayName: "Airbnb" },
    { name: "X", url: "https://x.com/thilokonzok", displayName: "X" },
    { name: "LinkedIn", url: "https://www.linkedin.com/in/konzok/", displayName: "LinkedIn" },
  ]

  // Multi-word company names that should be treated as a single link
  const multiWordCompanies: MultiWordCompany[] = []

  // Suggestions for help
  const helpSuggestions = ["Invest in my company", "Support with design", "Start coinvesting"]

  // Suggestions for contact
  const contactSuggestions = ["linkedin.com/in/yourname", "Your LinkedIn profile URL", "@yourname"]

  // Get user information
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get browser information - simplified to just get the browser name
        const userAgent = navigator.userAgent
        const browserName = userAgent.includes("Chrome")
          ? "Chrome"
          : userAgent.includes("Firefox")
            ? "Firefox"
            : userAgent.includes("Safari")
              ? "Safari"
              : userAgent.includes("Edge")
                ? "Edge"
                : "Unknown"

        // Get referrer information
        const referrer = document.referrer || "direct"
        let referrerSource = "direct"

        // Extract domain from referrer
        if (referrer && referrer !== "direct") {
          try {
            const referrerUrl = new URL(referrer)
            const domain = referrerUrl.hostname

            // Identify common referrers
            if (domain.includes("twitter") || domain.includes("x.com")) {
              referrerSource = "Twitter"
            } else if (domain.includes("facebook") || domain.includes("fb.com")) {
              referrerSource = "Facebook"
            } else if (domain.includes("linkedin")) {
              referrerSource = "LinkedIn"
            } else if (domain.includes("instagram")) {
              referrerSource = "Instagram"
            } else if (domain.includes("google")) {
              referrerSource = "Google"
            } else {
              // Use the domain as the source if not a known platform
              referrerSource = domain
            }
          } catch (e) {
            console.error("Error parsing referrer:", e)
            referrerSource = "unknown"
          }
        }

        // Get IP and location information using a free API
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()

        setUserInfo({
          browser: browserName,
          ip: data.ip || "Unknown",
          country: data.country_name || "Unknown",
          region: data.city || "Unknown", // Using city instead of region for more specific location
          city: data.city || "Unknown",
          referrer: referrerSource,
        })

        // Send pageview webhook
        await fetch("/api/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            eventType: "pageview",
            data: {
              browser: browserName,
              ip: data.ip || "Unknown",
              country: data.country_name || "Unknown",
              region: data.city || "Unknown", // Using city instead of region
              city: data.city || "Unknown",
              referrer: referrerSource,
            },
          }),
        })
      } catch (error) {
        console.error("Error getting user info:", error)
        setUserInfo({
          browser: "Unknown",
          ip: "Unknown",
          country: "Unknown",
          region: "Unknown",
          city: "Unknown",
          referrer: "Unknown",
        })
      }
    }

    getUserInfo()
  }, [])

  // Track clicks
  const trackClick = async (element: string, isMercor = false, inputValue = "") => {
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventType: isMercor ? "mercor_click" : "click",
          data: {
            element,
            inputValue,
            ...userInfo,
          },
        }),
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }
  }

  // Get current suggestion with bounds checking
  const getCurrentSuggestion = () => {
    try {
      const suggestions = currentStep === "initial" ? helpSuggestions : contactSuggestions
      const index = Math.min(Math.max(0, currentSuggestion), suggestions.length - 1)
      return suggestions[index] || ""
    } catch (error) {
      console.error("Error getting current suggestion:", error)
      return ""
    }
  }

  // Get current suggestion text
  const currentSuggestionText = getCurrentSuggestion()

  // Split current suggestion into words
  const currentSuggestionWords = safeStringSplit(currentSuggestionText)

  // Auto-focus input on initial render
  useEffect(() => {
    try {
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (error) {
      console.error("Error focusing input:", error)
    }
  }, [])

  // Animate sentences appearing one after another
  useEffect(() => {
    if (currentStep === "initial") {
      // Start animating the first sentence
      const animateSentence = (sentenceIndex: number) => {
        if (sentenceIndex >= sentences.length) return

        // Animate words in the current sentence
        if (visibleWords[sentenceIndex] < sentences[sentenceIndex].length) {
          const timer = setTimeout(() => {
            try {
              const newVisibleWords = [...visibleWords]
              newVisibleWords[sentenceIndex] = newVisibleWords[sentenceIndex] + 1
              setVisibleWords(newVisibleWords)
            } catch (error) {
              console.error("Error updating visible words:", error)
            }
          }, 25) // Fast animation (25ms)
          return () => clearTimeout(timer)
        }
        // When current sentence is complete, move to the next sentence
        else if (sentenceIndex < sentences.length - 1 && visibleSentence === sentenceIndex) {
          const timer = setTimeout(() => {
            try {
              setVisibleSentence(sentenceIndex + 1)
            } catch (error) {
              console.error("Error updating visible sentence:", error)
            }
          }, 400) // Delay between sentences
          return () => clearTimeout(timer)
        }
      }

      return animateSentence(visibleSentence)
    }
  }, [currentStep, visibleSentence, visibleWords])

  // Animate contact message words appearing one by one
  useEffect(() => {
    if (currentStep === "contact" && contactVisibleWords < contactWords.length) {
      const timer = setTimeout(() => {
        try {
          setContactVisibleWords((prev) => prev + 1)
        } catch (error) {
          console.error("Error updating contact visible words:", error)
        }
      }, 25) // Fast animation (25ms)
      return () => clearTimeout(timer)
    }
  }, [contactVisibleWords, contactWords.length, currentStep])

  // Animate thanks message words appearing one by one
  useEffect(() => {
    if (currentStep === "thanks" && thanksVisibleWords < thanksWords.length) {
      const timer = setTimeout(() => {
        try {
          setThanksVisibleWords((prev) => prev + 1)
        } catch (error) {
          console.error("Error updating thanks visible words:", error)
        }
      }, 25) // Fast animation (25ms)
      return () => clearTimeout(timer)
    }
  }, [thanksVisibleWords, thanksWords.length, currentStep])

  // Return to home page after showing thanks message
  useEffect(() => {
    if (currentStep === "thanks" && thanksVisibleWords === thanksWords.length) {
      const timer = setTimeout(() => {
        try {
          setCurrentStep("initial")
          setVisibleSentence(0)
          setVisibleWords([0, 0, 0])
          setSavedInquiry("") // Clear saved inquiry
        } catch (error) {
          console.error("Error resetting state after thanks:", error)
        }
      }, 4000) // Show thanks message for 4 seconds
      return () => clearTimeout(timer)
    }
  }, [currentStep, thanksVisibleWords, thanksWords.length])

  // Animate suggestion words appearing and disappearing
  useEffect(() => {
    try {
      if (isAnimatingSuggestion) {
        // Reset blur when starting new animation
        setSuggestionBlur(0)

        if (suggestionVisibleWords < currentSuggestionWords.length) {
          // Animate words appearing one by one with blur effect - 2x slower
          const timer = setTimeout(() => {
            setSuggestionVisibleWords((prev) => prev + 1)
          }, 76) // 2x slower (was 38ms)
          return () => clearTimeout(timer)
        } else {
          // All words are visible, wait before starting to hide
          const timer = setTimeout(() => {
            setIsAnimatingSuggestion(false)
          }, 2500) // Show complete suggestion for longer
          return () => clearTimeout(timer)
        }
      } else {
        // Start increasing blur before hiding words
        if (suggestionBlur < 8) {
          const timer = setTimeout(() => {
            setSuggestionBlur((prev) => prev + 1)
          }, 25)
          return () => clearTimeout(timer)
        }
        // Start hiding words after blur effect
        else if (suggestionVisibleWords > 0) {
          const timer = setTimeout(() => {
            setSuggestionVisibleWords((prev) => prev - 1)
          }, 40)
          return () => clearTimeout(timer)
        } else {
          // All words are hidden, move to next suggestion
          const timer = setTimeout(() => {
            try {
              const suggestions = currentStep === "initial" ? helpSuggestions : contactSuggestions
              setCurrentSuggestion((prev) => (prev + 1) % suggestions.length)
              setIsAnimatingSuggestion(true)
            } catch (error) {
              console.error("Error updating suggestion:", error)
              // Reset to first suggestion if there's an error
              setCurrentSuggestion(0)
              setIsAnimatingSuggestion(true)
            }
          }, 800) // Longer wait before showing next suggestion
          return () => clearTimeout(timer)
        }
      }
    } catch (error) {
      console.error("Error in suggestion animation:", error)
    }
  }, [
    suggestionVisibleWords,
    currentSuggestionWords.length,
    isAnimatingSuggestion,
    currentSuggestion,
    currentStep,
    helpSuggestions.length,
    contactSuggestions.length,
    suggestionBlur,
  ])

  // Function to check if a word has a comma at the end
  const hasCommaAtEnd = (word: string) => {
    return word?.endsWith(",") || false
  }

  // Function to remove comma from a word
  const removeComma = (word: string) => {
    return word?.replace(/,$/, "") || ""
  }

  // Function to check if a word is part of a multi-word company name
  const isPartOfMultiWordCompany = (index: number, wordWithoutComma: string, sentenceWords: string[]) => {
    try {
      for (const company of multiWordCompanies) {
        const firstWordIndex = sentenceWords.findIndex(
          (w, i) => i >= index - company.words.length + 1 && i <= index && removeComma(w) === company.words[0],
        )

        if (firstWordIndex !== -1) {
          let isMatch = true
          for (let i = 0; i < company.words.length; i++) {
            const wordIndex = firstWordIndex + i
            if (wordIndex > index || removeComma(sentenceWords[wordIndex]) !== company.words[i]) {
              isMatch = false
              break
            }
          }

          if (isMatch && wordWithoutComma === company.words[company.words.length - 1]) {
            return { isMultiWord: true, company, firstWordIndex }
          }
        }
      }
    } catch (error) {
      console.error("Error checking multi-word company:", error)
    }

    return { isMultiWord: false }
  }

  // Send notification (webhook or other method)
  const sendNotification = async (inquiry: string, contact: string) => {
    try {
      setIsSubmitting(true)

      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inquiry,
          contact,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error("Failed to send notification:", error)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Track the submit button click with the current input value
      const currentInputValue = currentStep === "initial" ? userInput : contactInfo
      trackClick("submit", false, currentInputValue)

      if (currentStep === "initial") {
        if (!userInput.trim()) {
          // Focus the input if it's empty
          if (inputRef.current) {
            inputRef.current.focus()
          }
          return
        }
        // Save the inquiry and move to contact step
        setSavedInquiry(userInput)
        setCurrentStep("contact")
        setUserInput("")
        setContactVisibleWords(0)
        return
      }

      if (currentStep === "contact" && !isSubmitting) {
        if (contactInfo.trim()) {
          // Send notification with collected information
          const success = await sendNotification(savedInquiry, contactInfo)

          if (success) {
            // Show thanks message
            setCurrentStep("thanks")
            setThanksVisibleWords(0)
            setUserInput("")
            setContactInfo("")
            setSuggestionVisibleWords(0)
            setSuggestionBlur(0)
            setIsAnimatingSuggestion(true)
          }
        }
      }
    } catch (error) {
      console.error("Error in form submission:", error)
    }
  }

  // Determine if button should be active
  const isButtonActive =
    currentStep === "initial"
      ? userInput.trim().length > 0
      : currentStep === "contact"
        ? contactInfo.trim().length > 0 && !isSubmitting
        : false

  // Process words for a sentence to handle company links
  const processSentenceWords = (sentenceWords: string[], sentenceIndex: number) => {
    try {
      const processedWords: React.ReactNode[] = []
      let skipCount = 0

      // Determine text color based on sentence index
      const textColor = sentenceIndex === 0 ? "text-black" : "text-[#7C7C7C]"
      const linkClass = sentenceIndex === 0 ? "text-black px-1" : "text-[#7C7C7C] px-1"

      sentenceWords.forEach((word, index) => {
        if (skipCount > 0) {
          skipCount--
          return
        }

        const hasComma = hasCommaAtEnd(word)
        const wordWithoutComma = hasComma ? removeComma(word) : word
        const isVisible = index < visibleWords[sentenceIndex]

        // Check if this word is part of a multi-word company
        const { isMultiWord, company, firstWordIndex } = isPartOfMultiWordCompany(
          index,
          wordWithoutComma,
          sentenceWords,
        )

        if (isMultiWord && company) {
          // This is the last word of a multi-word company
          const fullCompanyName = company.words.join(" ")

          // Skip the previous words that are part of this company name
          skipCount = company.words.length - 1

          processedWords.push(
            <span key={index} className={`inline-block ${isVisible ? "word-visible" : "word-hidden"}`}>
              <ExternalLink
                href={company.url}
                className={`${linkClass} ${isVisible ? "word-visible" : "word-hidden"}`}
                onClick={() => trackClick(fullCompanyName)}
              >
                {fullCompanyName}
              </ExternalLink>
              {hasComma && <span className={`${isVisible ? "word-visible" : "word-hidden"}`}>,</span>}{" "}
            </span>,
          )
        } else {
          // Check if this is a single-word company
          const singleCompany = companies.find(
            (c) => c.name === wordWithoutComma || c.name === wordWithoutComma.replace(".", ""),
          )

          // Skip if this word is part of a multi-word company but not the last word
          const isPartOfMultiWord = multiWordCompanies.some(
            (company) =>
              company.words.includes(wordWithoutComma) && company.words[company.words.length - 1] !== wordWithoutComma,
          )

          if (singleCompany && !isPartOfMultiWord) {
            // Special handling for words with punctuation
            if (word.endsWith(".")) {
              processedWords.push(
                <span key={index} className={`inline-block ${isVisible ? "word-visible" : "word-hidden"}`}>
                  <ExternalLink
                    href={singleCompany.url}
                    className={`${linkClass} ${isVisible ? "word-visible" : "word-hidden"}`}
                    onClick={() => trackClick(singleCompany.displayName)}
                  >
                    {singleCompany.displayName}
                  </ExternalLink>
                  <span className={`${isVisible ? "word-visible" : "word-hidden"}`}>.</span>&nbsp;
                </span>,
              )
            } else if (singleCompany.name === "Mercor") {
              // Special handling for Mercor to send a specific webhook
              processedWords.push(
                <span key={index} className={`inline-block ${isVisible ? "word-visible" : "word-hidden"}`}>
                  <ExternalLink
                    href={singleCompany.url}
                    className={`${linkClass} ${isVisible ? "word-visible" : "word-hidden"}`}
                    onClick={() => trackClick("Mercor", true)}
                  >
                    <span>{singleCompany.displayName}</span>
                  </ExternalLink>
                  {hasComma && <span className={`${isVisible ? "word-visible" : "word-hidden"}`}>,</span>}&nbsp;
                </span>,
              )
            } else {
              processedWords.push(
                <span key={index} className={`inline-block ${isVisible ? "word-visible" : "word-hidden"}`}>
                  <ExternalLink
                    href={singleCompany.url}
                    className={`${linkClass} ${isVisible ? "word-visible" : "word-hidden"}`}
                    onClick={() => trackClick(singleCompany.displayName)}
                  >
                    <span>{singleCompany.displayName}</span>
                  </ExternalLink>
                  {hasComma && <span className={`${isVisible ? "word-visible" : "word-hidden"}`}>,</span>}&nbsp;
                </span>,
              )
            }
          } else if (!isPartOfMultiWord) {
            // Regular word
            processedWords.push(
              <span key={index} className={`inline-block ${isVisible ? "word-visible" : "word-hidden"}`}>
                <span>{word}</span>&nbsp;
              </span>,
            )
          }
        }
      })

      return processedWords
    } catch (error) {
      console.error("Error processing sentence words:", error)
      return <span>Error displaying content</span>
    }
  }

  // Render the appropriate content based on current step
  const renderMainContent = () => {
    try {
      if (currentStep === "initial") {
        return (
          <div className="space-y-6">
            <p
              className={`text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left transition-opacity duration-500 ${visibleSentence >= 0 ? "opacity-100" : "opacity-0"}`}
            >
              {processSentenceWords(firstSentenceWords, 0)}
            </p>

            <p
              className={`text-[#7C7C7C] text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left transition-opacity duration-500 ${visibleSentence >= 1 ? "opacity-100" : "opacity-0"}`}
            >
              {processSentenceWords(secondSentenceWords, 1)}
            </p>

            <p
              className={`text-[#7C7C7C] text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left transition-opacity duration-500 ${visibleSentence >= 2 ? "opacity-100" : "opacity-0"}`}
            >
              {processSentenceWords(thirdSentenceWords, 2)}
            </p>
          </div>
        )
      } else if (currentStep === "contact") {
        return (
          <h1 className="text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left">
            {contactWords.map((word, index) => (
              <span
                key={index}
                className={`inline-block ${index < contactVisibleWords ? "word-visible" : "word-hidden"}`}
              >
                <span>{word}</span>&nbsp;
              </span>
            ))}
          </h1>
        )
      } else if (currentStep === "thanks") {
        return (
          <h1 className="text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left">
            {thanksWords.map((word, index) => (
              <span
                key={index}
                className={`inline-block ${index < thanksVisibleWords ? "word-visible" : "word-hidden"}`}
              >
                <span>{word}</span>&nbsp;
              </span>
            ))}
          </h1>
        )
      }
    } catch (error) {
      console.error("Error rendering main content:", error)
      return <div>Something went wrong. Please refresh the page.</div>
    }
  }

  return (
    <main className="min-h-screen bg-white flex flex-col justify-between">
      {/* Main content - vertically centered but left-aligned */}
      <div className="flex-grow flex items-center pt-16">
        <div className="container mx-auto px-8">{renderMainContent()}</div>
      </div>

      {/* Bottom section with input - hide when showing thanks message */}
      {currentStep !== "thanks" && (
        <div className="w-full py-6 mb-16">
          <div className="container mx-auto px-8">
            <div className="relative w-full">
              {/* Input and button row */}
              <div className="flex items-center justify-between">
                <div className="flex-1 relative">
                  {/* Animated suggestion placeholder */}
                  {(userInput === "" && currentStep === "initial") ||
                  (contactInfo === "" && currentStep === "contact") ? (
                    <div className="absolute inset-0 flex items-center pointer-events-none text-neutral-300">
                      {currentSuggestionWords.map((word, index) => (
                        <span
                          key={index}
                          className="inline-block text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight"
                          style={{
                            opacity: index < suggestionVisibleWords ? 1 : 0,
                            filter: `blur(${!isAnimatingSuggestion ? suggestionBlur : index < suggestionVisibleWords ? 0 : 8}px)`,
                            transform: index < suggestionVisibleWords ? "translateY(0)" : "translateY(10px)",
                            transition: "opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease",
                          }}
                        >
                          <span>{word}</span>&nbsp;
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* Actual input field */}
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentStep === "initial" ? userInput : contactInfo}
                    onChange={(e) =>
                      currentStep === "initial" ? setUserInput(e.target.value) : setContactInfo(e.target.value)
                    }
                    className="w-full py-2 text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight focus:outline-none border-none bg-transparent cursor-text"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit()
                      }
                    }}
                  />
                </div>

                {/* Circle arrow button */}
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`ml-4 p-2 rounded-full transition-colors flex items-center justify-center w-10.5 h-10.5 ${
                    isButtonActive ? "bg-[#FF4500] text-white" : "bg-[#E9E9E9] text-neutral-400"
                  } ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                  aria-label="Submit"
                >
                  <ArrowRight size={21} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function ExternalLink({
  href,
  children,
  className = "",
  onClick,
}: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link href={href} target="_blank" className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
