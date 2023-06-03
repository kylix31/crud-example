// Function to create a custom event
export function funcCreateCustomEvent(
  eventName: string,
  eventData?: any
): void {
  const customEvent = new CustomEvent(eventName, { detail: eventData })
  document.dispatchEvent(customEvent)
}

// Function to trigger a custom event
export function funcTriggerCustomEvent(eventName: string): void {
  const customEvent = new Event(eventName)
  document.dispatchEvent(customEvent)
}
