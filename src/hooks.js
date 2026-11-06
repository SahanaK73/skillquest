import { useEffect, useState } from 'react'

// Eased 0 -> 1 progress value, used to animate charts and bars on mount.
export function useProgress(duration = 1000, delay = 0, resetKey = 0) {
  const [p, setP] = useState(0)

  useEffect(() => {
    let raf
    let start
    setP(0)
    const t = setTimeout(() => {
      const tick = (now) => {
        if (start === undefined) start = now
        const v = Math.min(1, (now - start) / duration)
        setP(1 - Math.pow(1 - v, 3))
        if (v < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(raf)
    }
  }, [duration, delay, resetKey])

  return p
}
