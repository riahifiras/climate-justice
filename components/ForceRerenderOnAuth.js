"use client"
import { useEffect, useState } from 'react'

export default function ForceRerenderOnAuth({ children }) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const handler = () => setTick(t => t + 1)
    window.addEventListener('cj-auth-changed', handler)
    return () => window.removeEventListener('cj-auth-changed', handler)
  }, [])
  return children
}
