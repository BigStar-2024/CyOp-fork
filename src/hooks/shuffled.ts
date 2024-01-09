import { jpChars } from "mockup"
import { useState, useEffect } from "react"

interface ITyped {
  text: string
  start: boolean
  startDelay?: number
  speed?: number
  soundFile?: string
  noSound?: boolean
  endDelay?: number
  onComplete?: () => void
}

// const codeletters = "&#*+%-?£@§$"

const generateRandomString = (length: number) => {
  let random_text = ''
  const random_length = jpChars.length
  while (random_text.length < length) {
    random_text += jpChars.charAt(Math.floor(Math.random() * random_length))
  }

  return random_text
}

export default function useShuffled({
  text,
  start,
  startDelay = 0,
  speed = 50,
  noSound = false,
  endDelay = 500,
  onComplete
}: ITyped): string {
  const [currentString, setCurrentString] = useState("")

  let timer: NodeJS.Timeout
  let fadeBuffer: Array<{ c: number, l: string }> = []

  const fillBuffer = (text: string) => {
    for (let i = 0; i < text.length; i++) {
      fadeBuffer.push({ c: Math.floor(Math.random() * 4), l: text.charAt(i) })
    }
  }

  const animateFadeBuffer = (text: string) => {

    let do_cycles = false
    let message = ''
    const randomeLength = jpChars.length

    for (let fader of fadeBuffer) {
      if (fader.c > 0) {
        do_cycles = true
        fader.c--
        message += jpChars.charAt(Math.floor(Math.random() * randomeLength))
      } else {
        message += fader.l
      }
    }

    setCurrentString(message)

    if (do_cycles) {
      setTimeout(() => animateFadeBuffer(text), 150)
    } else {
      setTimeout(() => {
        onComplete && onComplete()
      }, endDelay)
    }
  }

  let current_length = 0

  const animateIn = (text: string) => {

    if (current_length < text.length) {
      current_length += 20
      if (current_length > text.length) {
        current_length = text.length
      }

      let message = generateRandomString(current_length)
      setCurrentString(message)

      setTimeout(() => animateIn(text), 150)
    } else {
      fillBuffer(text)
      animateFadeBuffer(text)
    }
  }

  useEffect(() => {
    if (start) {
      // eslint-disable-next-line
      timer = setTimeout(() => {
        animateIn(text)
      }, startDelay ?? 0)

      // Remove event listeners on cleanup
      return () => {
        clearTimeout(timer)
      }
    }
  }, [start, text]) // Empty array ensures that effect is only run on mount and unmount

  return currentString
}
