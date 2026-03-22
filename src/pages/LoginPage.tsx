import { useEffect } from "react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { createSalesforceAccount } from "@/api/SalesforceApi"

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user])

  useEffect(() => {
    if (!window.google) return

    window.google.accounts.id.initialize({
      client_id: "540856577645-5udfep8m5v041b4hvtcakk983qf2ctpc.apps.googleusercontent.com",
      callback: handleCredentialResponse
    })

    window.google.accounts.id.renderButton(
      document.getElementById("googleBtn"),
      {
        theme: "outline",
        size: "large",
        width: 300
      }
    )
  }, [])

async function handleCredentialResponse(response: any) {
  try {
    const res = await fetch(
      "https://inventoryapp-cisl.onrender.com/api/auth/google",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: response.credential
        })
      }
    )

    const data = await res.json()

    login(data.token, {
      id: data.user.id,
      userName: data.user.userName ?? data.user.name ?? data.user.email,
      email: data.user.email,
      picture: data.user.picture,
      isAdmin: data.user.isAdmin,
      isBlocked: data.user.isBlocked,
      createdAt: data.user.createdAt
    })

    const fullName = data.user.userName || ""
    const [firstName, lastName] = fullName.split(" ")

  } catch (err) {
    console.error(err)
  }
}

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <div className="p-8 border rounded-xl shadow-md w-[350px] text-center">
        <h2 className="text-xl font-bold mb-6">Login</h2>

        <div id="googleBtn"></div>
      </div>
    </div>
  )
}