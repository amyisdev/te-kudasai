import { useEffect, useState } from 'react'

export default function useDebounce<T>(initialValue: T, delay: number) {
  const realDelay = process.env.NODE_ENV === 'test' ? 0 : delay

  const [immediateValue, setImmediateValue] = useState(initialValue)
  const [debouncedValue, setDebouncedValue] = useState(initialValue)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(immediateValue)
    }, realDelay)

    return () => {
      clearTimeout(handler)
    }
  }, [immediateValue, realDelay])

  return [debouncedValue, immediateValue, setImmediateValue] as const
}
