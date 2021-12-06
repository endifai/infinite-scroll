import { MutableRefObject, useEffect, useRef, useState } from 'react'

type Result<T> = {
  inView: boolean
  ref: MutableRefObject<T | null>
}

export const useInView = <T extends HTMLElement>(
  options: IntersectionObserverInit,
): Result<T> => {
  const [inView, setInView] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries

        setInView(entry.isIntersecting)
      },
      options,
    )

    ref.current && observer.observe(ref.current)

    return () => {
      ref.current && observer.unobserve(ref.current)
    }
  }, [ref])

  return { inView, ref }
}
