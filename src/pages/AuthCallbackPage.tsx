import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function AuthCallbackPage() {

  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {

    try {

      const params = new URLSearchParams(window.location.search)

      const token = params.get("token")
      const userParam = params.get("user")

      if (!token || !userParam) {
        navigate("/login")
        return
      }

      const user = JSON.parse(decodeURIComponent(userParam))

      login(token, user)

      navigate("/")

    } catch (error) {

      console.error("OAuth error:", error)
      navigate("/login")

    }

  }, [])

  return (

    <div className="flex items-center justify-center h-screen bg-gray-50">

      <div className="flex flex-col items-center gap-4">

        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-600 text-lg">
          Signing you in with Google...
        </p>

      </div>

    </div>

  )

}