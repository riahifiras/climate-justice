"use client"
import { useEffect, useState } from 'react'
import AuthGate from './AuthGate'
import { getCurrentUser } from '../lib/auth'

export default function AuthGateWrapper() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // initial load
    setUser(getCurrentUser())

    // listen for auth changes dispatched by other components (login/logout)
    const handler = () => setUser(getCurrentUser())
    window.addEventListener('cj-auth-changed', handler)
    return () => window.removeEventListener('cj-auth-changed', handler)
  }, [])

  if (user) return null
  // When AuthGate calls onAuth, update local state instead of forcing a full reload
  return <AuthGate onAuth={(u) => { setUser(u); window.dispatchEvent(new Event('cj-auth-changed')) }} />
}
