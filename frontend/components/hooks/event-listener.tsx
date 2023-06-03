import { useEffect, useRef } from "react"

export function useCustomEvent(eventName: string, eventData: any) {
  const eventRef = useRef<CustomEvent | null>(null)

  useEffect(() => {
    // Create the custom event
    const event = new CustomEvent(eventName, { detail: eventData })
    eventRef.current = event

    // Clean up the event when the component unmounts
    return () => {
      eventRef.current = null
    }
  }, [eventName, eventData])

  function dispatchCustomEvent() {
    if (eventRef.current) {
      document.dispatchEvent(eventRef.current)
    }
  }

  return dispatchCustomEvent
}

export function useCustomEventTrigger(
  eventName: string,
  eventHandler: (data: any) => void
) {
  useEffect(() => {
    // Add event listener to listen for the custom event
    const handleCustomEvent = (event: Event) => {
      if (event.type === eventName) {
        eventHandler((event as CustomEvent).detail)
      }
    }

    document.addEventListener(eventName, handleCustomEvent)

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener(eventName, handleCustomEvent)
    }
  }, [eventName, eventHandler])
}
