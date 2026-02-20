<script lang="ts">
  import { onDestroy, onMount } from 'svelte'

  type Step = 'initial' | 'contact' | 'thanks'

  interface Company {
    name: string
    url: string
    displayName: string
  }

  interface MultiWordCompany {
    words: string[]
    url: string
  }

  interface UserInfo {
    browser: string
    ip: string
    country: string
    region: string
    city: string
    referrer: string
  }

  interface ProcessedWord {
    key: string
    type: 'word' | 'link'
    text: string
    href?: string
    trackName?: string
    globalWordIndex: number
    isMercor?: boolean
    punctuation?: ',' | '.'
    linkClass: string
  }

  let visibleWordCount = 0
  let currentStep: Step = 'initial'
  let userInput = ''
  let savedInquiry = ''
  let contactInfo = ''
  let currentSuggestion = 0
  let suggestionVisibleWords = 0
  let isAnimatingSuggestion = true
  let suggestionBlur = 0
  let contactVisibleWords = 0
  let thanksVisibleWords = 0
  let isSubmitting = false
  let inputRef: HTMLInputElement | null = null
  let userInfo: UserInfo = {
    browser: 'Unknown',
    ip: 'Unknown',
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown',
    referrer: 'Unknown',
  }

  const firstSentence = 'Thilo is Uncommon Founder, Partner and Sequoia Arc Advisor.'
  const secondSentence =
    'He invested, advised or designed Mercor, Dash0, Delphi, Squint, Fleet, Build, Ark, GradientLabs, Medra, CrewAI, nsave, Ironbridge, DiligenceSquared, Popcorn, Lemni, Morphic, Compile, Lapel, Orbit, Sensmore, Nolla, Luo, Hero, Partykit, GuidedEnergy, CommerceSystems, Claim, Structify, Snaptrude, Superlinked, Tilebox, Amperecloud, Equipme, Documenso and Era, founded Home, worked at Airbnb in 2011 and studied architecture – DM anytime on X or LinkedIn.'
  const thirdSentence = 'How can we work together?'
  const contactMessage = "What's your Linkedin?"
  const thanksMessage = "I'm looking forward to meeting you."

  const helpSuggestions = ['Invest in my company', 'Support with design', 'Start coinvesting']
  const contactSuggestions = ['linkedin.com/in/yourname', 'Your LinkedIn profile URL', '@yourname']

  const companies: Company[] = [
    { name: 'Uncommon', url: 'https://www.unc.mn/', displayName: 'Uncommon' },
    { name: 'Sequoia', url: 'https://www.sequoiacap.com', displayName: 'Sequoia' },
    { name: 'Mercor', url: 'https://mercor.com/', displayName: 'Mercor' },
    { name: 'Delphi', url: 'https://www.delphi.gg', displayName: 'Delphi' },
    { name: 'Squint', url: 'https://www.squint.ai/', displayName: 'Squint' },
    { name: 'Dash0', url: 'http://dash0.com/', displayName: 'Dash0' },
    { name: 'Fleet', url: 'https://www.fleet.so/', displayName: 'Fleet' },
    { name: 'Build', url: 'https://www.build.inc/', displayName: 'Build' },
    { name: 'Ark', url: 'https://ark-robotics.com', displayName: 'Ark' },
    { name: 'GradientLabs', url: 'https://gradient-labs.ai/', displayName: 'GradientLabs' },
    { name: 'Medra', url: 'https://www.medralabs.com/', displayName: 'Medra' },
    { name: 'CrewAI', url: 'https://www.crewai.com/', displayName: 'CrewAI' },
    { name: 'nsave', url: 'https://www.nsave.com/', displayName: 'nsave' },
    { name: 'Ironbridge', url: 'https://ironbridgesp.com', displayName: 'Ironbridge' },
    { name: 'DiligenceSquared', url: 'https://www.diligencesquared.com', displayName: 'DiligenceSquared' },
    { name: 'Lemni', url: 'https://www.lemni.com/', displayName: 'Lemni' },
    { name: 'Morphic', url: 'https://www.morphic.com/', displayName: 'Morphic' },
    { name: 'Compile', url: 'https://compilelabs.ai/', displayName: 'Compile' },
    { name: 'Lapel', url: 'https://lapel.com/', displayName: 'Lapel' },
    { name: 'Orbit', url: 'https://www.orbit.engineering/', displayName: 'Orbit' },
    { name: 'Sensmore', url: 'http://sensmore.ai/', displayName: 'Sensmore' },
    { name: 'Nolla', url: 'https://www.nollahealth.com/', displayName: 'Nolla' },
    { name: 'Luo', url: 'https://www.luopay.co/', displayName: 'Luo' },
    { name: 'Hero', url: 'https://herostuff.com/', displayName: 'Hero' },
    { name: 'Popcorn', url: 'https://popcorn.space/', displayName: 'Popcorn' },
    { name: 'Partykit', url: 'http://partykit.io', displayName: 'Partykit' },
    { name: 'GuidedEnergy', url: 'https://guided.energy/', displayName: 'Guided Energy' },
    { name: 'CommerceSystems', url: 'https://commercesystems.com/', displayName: 'Commerce Systems' },
    { name: 'Claim', url: 'https://www.claim.co', displayName: 'Claim' },
    { name: 'Structify', url: 'https://structify.ai/', displayName: 'Structify' },
    { name: 'Snaptrude', url: 'https://www.snaptrude.com/', displayName: 'Snaptrude' },
    { name: 'Superlinked', url: 'https://superlinked.com/', displayName: 'Superlinked' },
    { name: 'Tilebox', url: 'https://tilebox.io/', displayName: 'Tilebox' },
    { name: 'Amperecloud', url: 'https://www.amperecloud.com/', displayName: 'Amperecloud' },
    { name: 'Equipme', url: 'https://equipme.io', displayName: 'Equipme' },
    { name: 'Documenso', url: 'https://documenso.com/', displayName: 'Documenso' },
    { name: 'Era', url: 'https://era.app/', displayName: 'Era' },
    { name: 'Airbnb', url: 'https://www.airbnb.com', displayName: 'Airbnb' },
    { name: 'X', url: 'https://x.com/thilokonzok', displayName: 'X' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/konzok/', displayName: 'LinkedIn' },
  ]

  const multiWordCompanies: MultiWordCompany[] = []

  const firstSentenceWords = safeStringSplit(firstSentence)
  const secondSentenceWords = safeStringSplit(secondSentence)
  const thirdSentenceWords = safeStringSplit(thirdSentence)
  const sentences = [firstSentenceWords, secondSentenceWords, thirdSentenceWords]
  const contactWords = safeStringSplit(contactMessage)
  const thanksWords = safeStringSplit(thanksMessage)
  const totalInitialWords = sentences.reduce((total, words) => total + words.length, 0)
  const initialSentenceWordOffsets = [
    0,
    firstSentenceWords.length,
    firstSentenceWords.length + secondSentenceWords.length,
  ]

  let currentSuggestionText = ''
  let currentSuggestionWords: string[] = []

  const timers: {
    sentence?: ReturnType<typeof setTimeout>
    contact?: ReturnType<typeof setTimeout>
    thanks?: ReturnType<typeof setTimeout>
    reset?: ReturnType<typeof setTimeout>
    suggestion?: ReturnType<typeof setTimeout>
  } = {}

  onMount(() => {
    visibleWordCount = 0
    inputRef?.focus()
    void getUserInfo()
    startSentenceAnimation()
  })

  onDestroy(() => {
    clearTimeout(timers.sentence)
    clearTimeout(timers.contact)
    clearTimeout(timers.thanks)
    clearTimeout(timers.reset)
    clearTimeout(timers.suggestion)
  })

  $: currentSuggestionText = getCurrentSuggestion()
  $: currentSuggestionWords = safeStringSplit(currentSuggestionText)

  function startSentenceAnimation() {
    if (currentStep !== 'initial') {
      return
    }

    clearTimeout(timers.sentence)
    if (visibleWordCount < totalInitialWords) {
      visibleWordCount += 1
      timers.sentence = setTimeout(startSentenceAnimation, 25)
    }
  }

  $: {
    clearTimeout(timers.contact)
    timers.contact = undefined

    if (currentStep === 'contact' && contactVisibleWords < contactWords.length) {
      timers.contact = setTimeout(() => {
        contactVisibleWords += 1
      }, 25)
    }
  }

  $: {
    clearTimeout(timers.thanks)
    timers.thanks = undefined

    if (currentStep === 'thanks' && thanksVisibleWords < thanksWords.length) {
      timers.thanks = setTimeout(() => {
        const nextVisibleWords = thanksVisibleWords + 1
        thanksVisibleWords = nextVisibleWords

        if (nextVisibleWords === thanksWords.length) {
          clearTimeout(timers.reset)
          timers.reset = setTimeout(() => {
            currentStep = 'initial'
            visibleWordCount = 0
            savedInquiry = ''
            currentSuggestion = 0
            startSentenceAnimation()
          }, 4000)
        }
      }, 25)
    }
  }

  function getWordRevealClass(globalWordIndex: number, revealCount: number) {
    if (currentStep !== 'initial') {
      return 'word-visible'
    }

    return globalWordIndex < revealCount ? 'word-visible' : 'word-hidden'
  }

  function getGlobalWordIndex(sentenceIndex: number, localWordIndex: number) {
    return localWordIndex + (initialSentenceWordOffsets[sentenceIndex] ?? 0)
  }

  $: {
    clearTimeout(timers.suggestion)
    timers.suggestion = undefined

    const suggestions = currentStep === 'initial' ? helpSuggestions : contactSuggestions
    const safeSuggestionCount = suggestions.length || 1

    if (isAnimatingSuggestion) {
      if (suggestionBlur !== 0) {
        suggestionBlur = 0
      }

      if (suggestionVisibleWords < currentSuggestionWords.length) {
        timers.suggestion = setTimeout(() => {
          suggestionVisibleWords += 1
        }, 76)
      } else {
        timers.suggestion = setTimeout(() => {
          isAnimatingSuggestion = false
        }, 2500)
      }
    } else if (suggestionBlur < 8) {
      timers.suggestion = setTimeout(() => {
        suggestionBlur += 1
      }, 25)
    } else if (suggestionVisibleWords > 0) {
      timers.suggestion = setTimeout(() => {
        suggestionVisibleWords -= 1
      }, 40)
    } else {
      timers.suggestion = setTimeout(() => {
        currentSuggestion = (currentSuggestion + 1) % safeSuggestionCount
        isAnimatingSuggestion = true
      }, 800)
    }
  }

  async function getUserInfo() {
    try {
      const userAgent = navigator.userAgent
      const browserName = userAgent.includes('Chrome')
        ? 'Chrome'
        : userAgent.includes('Firefox')
          ? 'Firefox'
          : userAgent.includes('Safari')
            ? 'Safari'
            : userAgent.includes('Edge')
              ? 'Edge'
              : 'Unknown'

      const referrer = document.referrer || 'direct'
      let referrerSource = 'direct'

      if (referrer && referrer !== 'direct') {
        try {
          const referrerUrl = new URL(referrer)
          const domain = referrerUrl.hostname

          if (domain.includes('twitter') || domain.includes('x.com')) {
            referrerSource = 'Twitter'
          } else if (domain.includes('facebook') || domain.includes('fb.com')) {
            referrerSource = 'Facebook'
          } else if (domain.includes('linkedin')) {
            referrerSource = 'LinkedIn'
          } else if (domain.includes('instagram')) {
            referrerSource = 'Instagram'
          } else if (domain.includes('google')) {
            referrerSource = 'Google'
          } else {
            referrerSource = domain
          }
        } catch (error) {
          console.error('Error parsing referrer:', error)
          referrerSource = 'unknown'
        }
      }

      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()

      userInfo = {
        browser: browserName,
        ip: data.ip || 'Unknown',
        country: data.country_name || 'Unknown',
        region: data.city || 'Unknown',
        city: data.city || 'Unknown',
        referrer: referrerSource,
      }

      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'pageview',
          data: {
            browser: browserName,
            ip: data.ip || 'Unknown',
            country: data.country_name || 'Unknown',
            region: data.city || 'Unknown',
            city: data.city || 'Unknown',
            referrer: referrerSource,
          },
        }),
      })
    } catch (error) {
      console.error('Error getting user info:', error)
      userInfo = {
        browser: 'Unknown',
        ip: 'Unknown',
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        referrer: 'Unknown',
      }
    }
  }

  function safeStringSplit(str: string | undefined) {
    if (typeof str === 'string') {
      return str.split(/\s+/)
    }

    return []
  }

  async function trackClick(element: string, isMercor = false, inputValueText = '') {
    try {
      await fetch('/api/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: isMercor ? 'mercor_click' : 'click',
          data: {
            element,
            inputValue: inputValueText,
            ...userInfo,
          },
        }),
      })
    } catch (error) {
      console.error('Error tracking click:', error)
    }
  }

  function getCurrentSuggestion() {
    try {
      const suggestions = currentStep === 'initial' ? helpSuggestions : contactSuggestions
      const index = Math.min(Math.max(0, currentSuggestion), suggestions.length - 1)
      return suggestions[index] || ''
    } catch (error) {
      console.error('Error getting current suggestion:', error)
      return ''
    }
  }

  function hasCommaAtEnd(word: string) {
    return word.endsWith(',')
  }

  function removeComma(word: string) {
    return word.replace(/,$/, '')
  }

  function isPartOfMultiWordCompany(index: number, wordWithoutComma: string, sentenceWords: string[]) {
    for (const company of multiWordCompanies) {
      const firstWordIndex = sentenceWords.findIndex(
        (w, i) => i >= index - company.words.length + 1 && i <= index && removeComma(w) === company.words[0],
      )

      if (firstWordIndex !== -1) {
        let isMatch = true

        for (let i = 0; i < company.words.length; i += 1) {
          const wordIndex = firstWordIndex + i
          if (wordIndex > index || removeComma(sentenceWords[wordIndex]) !== company.words[i]) {
            isMatch = false
            break
          }
        }

        if (isMatch && wordWithoutComma === company.words[company.words.length - 1]) {
          return { isMultiWord: true, company }
        }
      }
    }

    return { isMultiWord: false as const }
  }

  function processSentenceWords(sentenceWords: string[], sentenceIndex: number): ProcessedWord[] {
    const processedWords: ProcessedWord[] = []
    let skipCount = 0
    const linkClass = sentenceIndex === 0 ? 'text-black px-1' : 'text-[#7C7C7C] px-1'

    sentenceWords.forEach((word, index) => {
      if (skipCount > 0) {
        skipCount -= 1
        return
      }

      const hasComma = hasCommaAtEnd(word)
      const wordWithoutComma = hasComma ? removeComma(word) : word

      const { isMultiWord, company } = isPartOfMultiWordCompany(index, wordWithoutComma, sentenceWords)

      if (isMultiWord && company) {
        const fullCompanyName = company.words.join(' ')
        skipCount = company.words.length - 1

        processedWords.push({
          key: `${sentenceIndex}-${index}-multi`,
          type: 'link',
          text: fullCompanyName,
          href: company.url,
          trackName: fullCompanyName,
          punctuation: hasComma ? ',' : undefined,
          globalWordIndex: index,
          linkClass,
        })

        return
      }

      const singleCompany = companies.find(
        (candidate) =>
          candidate.name === wordWithoutComma || candidate.name === wordWithoutComma.replace('.', ''),
      )

      const isPartOfMultiWord = multiWordCompanies.some(
        (candidate) =>
          candidate.words.includes(wordWithoutComma) &&
          candidate.words[candidate.words.length - 1] !== wordWithoutComma,
      )

      if (singleCompany && !isPartOfMultiWord) {
        const punctuation = word.endsWith('.') ? '.' : hasComma ? ',' : undefined

        processedWords.push({
          key: `${sentenceIndex}-${index}-single`,
          type: 'link',
          text: singleCompany.displayName,
          href: singleCompany.url,
          trackName: singleCompany.displayName,
          isMercor: singleCompany.name === 'Mercor',
          punctuation,
          globalWordIndex: index,
          linkClass,
        })
      } else if (!isPartOfMultiWord) {
        processedWords.push({
          key: `${sentenceIndex}-${index}-word`,
          type: 'word',
          text: word,
          globalWordIndex: index,
          linkClass,
        })
      }
    })

    return processedWords
  }

  async function sendNotification(inquiry: string, contact: string) {
    try {
      isSubmitting = true

      const response = await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inquiry, contact }),
      })

      if (!response.ok) {
        throw new Error(`Failed to send notification: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    } finally {
      isSubmitting = false
    }
  }

  async function handleSubmit() {
    const currentInputValue = currentStep === 'initial' ? userInput : contactInfo
    void trackClick('submit', false, currentInputValue)

    if (currentStep === 'initial') {
      if (!userInput.trim()) {
        inputRef?.focus()
        return
      }

      savedInquiry = userInput
      currentStep = 'contact'
      userInput = ''
      contactVisibleWords = 0
      return
    }

    if (currentStep === 'contact' && !isSubmitting && contactInfo.trim()) {
      const success = await sendNotification(savedInquiry, contactInfo)

      if (success) {
        clearTimeout(timers.reset)
        currentStep = 'thanks'
        thanksVisibleWords = 0
        userInput = ''
        contactInfo = ''
        suggestionVisibleWords = 0
        suggestionBlur = 0
        isAnimatingSuggestion = true
      }
    }
  }

  function handleInput(event: Event) {
    const target = event.currentTarget as HTMLInputElement

    if (currentStep === 'initial') {
      userInput = target.value
    } else {
      contactInfo = target.value
    }
  }

  function handleExternalLinkClick(trackName: string | undefined, isMercor = false) {
    if (!trackName) {
      return
    }

    void trackClick(trackName, isMercor)
  }

  function getIsButtonActive() {
    if (currentStep === 'initial') {
      return userInput.trim().length > 0
    }

    if (currentStep === 'contact') {
      return contactInfo.trim().length > 0 && !isSubmitting
    }

    return false
  }
</script>

<main class="min-h-screen bg-white flex flex-col justify-between">
  <div class="flex-grow flex items-center pt-16">
    <div class="container mx-auto px-8">
      {#if currentStep === 'initial'}
        <div class="space-y-6">
          <p
            class="text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left"
          >
            {#each processSentenceWords(firstSentenceWords, 0) as token (token.key)}
              <span class={`inline-block ${getWordRevealClass(token.globalWordIndex, visibleWordCount)}`}>
                {#if token.type === 'link'}
                  <a
                    href={token.href}
                    target="_blank"
                    rel="noreferrer"
                    class={`${token.linkClass} ${getWordRevealClass(token.globalWordIndex, visibleWordCount)}`}
                    on:click={() => handleExternalLinkClick(token.trackName, token.isMercor)}
                  >
                    {token.text}
                  </a>
                  {#if token.punctuation}
                    <span class={getWordRevealClass(token.globalWordIndex, visibleWordCount)}>{token.punctuation}</span>
                  {/if}
                  {'\u00A0'}
                {:else}
                  <span>{token.text}</span>{'\u00A0'}
                {/if}
              </span>
            {/each}
          </p>

          <p
            class="text-[#7C7C7C] text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left"
          >
            {#each processSentenceWords(secondSentenceWords, 1) as token (token.key)}
              <span
                class={`inline-block ${getWordRevealClass(
                  getGlobalWordIndex(1, token.globalWordIndex),
                  visibleWordCount,
                )}`}
              >
                {#if token.type === 'link'}
                  <a
                    href={token.href}
                    target="_blank"
                    rel="noreferrer"
                    class={`${token.linkClass} ${getWordRevealClass(
                      getGlobalWordIndex(1, token.globalWordIndex),
                      visibleWordCount,
                    )}`}
                    on:click={() => handleExternalLinkClick(token.trackName, token.isMercor)}
                  >
                    {token.text}
                  </a>
                  {#if token.punctuation}
                    <span
                      class={getWordRevealClass(getGlobalWordIndex(1, token.globalWordIndex), visibleWordCount)}
                    >
                      {token.punctuation}
                    </span>
                  {/if}
                  {'\u00A0'}
                {:else}
                  <span>{token.text}</span>{'\u00A0'}
                {/if}
              </span>
            {/each}
          </p>

          <p
            class="text-[#7C7C7C] text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left"
          >
            {#each processSentenceWords(thirdSentenceWords, 2) as token (token.key)}
              <span
                class={`inline-block ${getWordRevealClass(
                  getGlobalWordIndex(2, token.globalWordIndex),
                  visibleWordCount,
                )}`}
              >
                {#if token.type === 'link'}
                  <a
                    href={token.href}
                    target="_blank"
                    rel="noreferrer"
                    class={`${token.linkClass} ${getWordRevealClass(
                      getGlobalWordIndex(2, token.globalWordIndex),
                      visibleWordCount,
                    )}`}
                    on:click={() => handleExternalLinkClick(token.trackName, token.isMercor)}
                  >
                    {token.text}
                  </a>
                  {#if token.punctuation}
                    <span class={getWordRevealClass(getGlobalWordIndex(2, token.globalWordIndex), visibleWordCount)}>
                      {token.punctuation}
                    </span>
                  {/if}
                  {'\u00A0'}
                {:else}
                  <span>{token.text}</span>{'\u00A0'}
                {/if}
              </span>
            {/each}
          </p>
        </div>
      {:else if currentStep === 'contact'}
        <h1 class="text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left">
          {#each contactWords as word, index (`contact-${index}`)}
            <span class={`inline-block ${index < contactVisibleWords ? 'word-visible' : 'word-hidden'}`}>
              <span>{word}</span>{'\u00A0'}
            </span>
          {/each}
        </h1>
      {:else}
        <h1 class="text-black text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight text-left">
          {#each thanksWords as word, index (`thanks-${index}`)}
            <span class={`inline-block ${index < thanksVisibleWords ? 'word-visible' : 'word-hidden'}`}>
              <span>{word}</span>{'\u00A0'}
            </span>
          {/each}
        </h1>
      {/if}
    </div>
  </div>

  {#if currentStep !== 'thanks'}
    <div class="w-full py-6 mb-16">
      <div class="container mx-auto px-8">
        <div class="relative w-full">
          <div class="flex items-center justify-between">
            <div class="flex-1 relative">
              {#if (userInput === '' && currentStep === 'initial') || (contactInfo === '' && currentStep === 'contact')}
                <div class="absolute inset-0 flex items-center pointer-events-none text-neutral-300">
                  {#each currentSuggestionWords as word, index (`suggestion-${index}`)}
                    <span
                      class="inline-block text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight"
                      style={`opacity: ${index < suggestionVisibleWords ? 1 : 0}; filter: blur(${!isAnimatingSuggestion ? suggestionBlur : index < suggestionVisibleWords ? 0 : 8}px); transform: ${index < suggestionVisibleWords ? 'translateY(0)' : 'translateY(10px)'}; transition: opacity 0.5s ease, filter 0.5s ease, transform 0.5s ease;`}
                    >
                      <span>{word}</span>{'\u00A0'}
                    </span>
                  {/each}
                </div>
              {/if}

              <input
                bind:this={inputRef}
                type="text"
                value={currentStep === 'initial' ? userInput : contactInfo}
                on:input={handleInput}
                class="w-full py-2 text-[20.2px] max-sm:text-[18px] leading-[143%] font-normal tracking-tight focus:outline-none border-none bg-transparent cursor-text"
                on:keydown={(event) => {
                  if (event.key === 'Enter') {
                    void handleSubmit()
                  }
                }}
              />
            </div>

            <button
              on:click={() => void handleSubmit()}
              disabled={isSubmitting}
              class={`ml-4 p-2 rounded-full transition-colors flex items-center justify-center w-[42px] h-[42px] ${getIsButtonActive() ? 'bg-[#FF4500] text-white' : 'bg-[#E9E9E9] text-neutral-400'} ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              aria-label="Submit"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</main>
