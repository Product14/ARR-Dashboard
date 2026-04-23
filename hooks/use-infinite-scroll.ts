import { useState, useEffect, useCallback, useRef } from 'react'

interface UseInfiniteScrollOptions {
  threshold?: number // Distance from bottom to trigger load (in pixels)
  rootMargin?: string // Intersection observer root margin
}

interface UseInfiniteScrollReturn {
  isFetching: boolean
  setIsFetching: (fetching: boolean) => void
  lastElementRef: (node: HTMLElement | null) => void
}

export function useInfiniteScroll(
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 100, rootMargin = '0px' } = options
  const [isFetching, setIsFetching] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const lastElementRef = useCallback(
    (node: HTMLElement | null) => {
      if (isFetching) return
      if (observerRef.current) observerRef.current.disconnect()

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setIsFetching(true)
          }
        },
        {
          rootMargin,
          threshold: 0.1,
        }
      )

      if (node) observerRef.current.observe(node)
    },
    [isFetching, rootMargin]
  )

  useEffect(() => {
    if (!isFetching) return

    const executeLoad = async () => {
      try {
        await fetchMore()
      } catch (error) {
        console.error('Error fetching more data:', error)
      } finally {
        setIsFetching(false)
      }
    }

    executeLoad()
  }, [isFetching, fetchMore])

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { isFetching, setIsFetching, lastElementRef }
}

// Alternative hook using scroll position detection
export function useScrollInfiniteLoad(
  fetchMore: () => Promise<void> | void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn {
  const { threshold = 100 } = options
  const [isFetching, setIsFetching] = useState(false)
  const containerRef = useRef<HTMLElement | null>(null)

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    if (distanceFromBottom < threshold) {
      setIsFetching(true)
    }
  }, [isFetching, threshold])

  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (node) {
      // Find the scrollable container (table container)
      const scrollContainer = node.closest('.overflow-x-auto') as HTMLElement
      if (scrollContainer) {
        containerRef.current = scrollContainer
      }
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isFetching) return

    const executeLoad = async () => {
      try {
        await fetchMore()
      } catch (error) {
        console.error('Error fetching more data:', error)
      } finally {
        setIsFetching(false)
      }
    }

    executeLoad()
  }, [isFetching, fetchMore])

  return { isFetching, setIsFetching, lastElementRef }
}

