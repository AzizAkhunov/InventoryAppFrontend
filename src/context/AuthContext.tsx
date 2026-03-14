import { createContext, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"
import axios from "axios"
import { useEffect } from "react"
import {jwtDecode} from "jwt-decode"
import { setupAxiosInterceptor } from "@/api/axiosInterceptor"


type JwtPayload = {
  name: string
  role: string
  nameid: string
}



type User = {
  id: string
  userName: string
  email: string
  picture?: string
  isAdmin: boolean
  isBlocked: boolean
  createdAt: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"))
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user")
    return raw ? JSON.parse(raw) : null
  })


useEffect(() => {
  setupAxiosInterceptor(logout)
}, [])


useEffect(() => {

  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
    delete axios.defaults.headers.common["Authorization"]
  }

}, [token])

  const login = (jwt: string, userData: User) => {
    setToken(jwt)
    setUser(userData)
    localStorage.setItem("token", jwt)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {

  window.google?.accounts.id.disableAutoSelect()

  setToken(null)
  setUser(null)

  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

  const value = useMemo(
    () => ({ user, token, login, logout }),
    [user, token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider")
  return ctx
}


function parseUser(token: string) {
  const decoded = jwtDecode<JwtPayload>(token)

  return {
    id: decoded.nameid,
    name: decoded.name,
    role: decoded.role
  }
}