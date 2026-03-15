import { Bell } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import * as signalR from "@microsoft/signalr"

import { useTranslation } from "react-i18next"
import { useTheme } from "@/context/ThemeContext"

import {
DropdownMenu,
DropdownMenuTrigger,
DropdownMenuContent,
DropdownMenuItem,
DropdownMenuLabel,
DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"

export default function Topbar() {

  const { user, login, logout } = useAuth()
  const navigate = useNavigate()

  const { i18n } = useTranslation()
  const { theme, setTheme } = useTheme()

  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const API = "https://inventoryapp-cisl.onrender.com/api"

  // LOAD NOTIFICATIONS

  useEffect(() => {

    if (!user) return

    fetch(`${API}/notification`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
      .then(res => res.json())
      .then(data => {

        setNotifications(data)

        const unread = data.filter((n: any) => !n.isRead).length
        setUnreadCount(unread)

      })

  }, [user])


  // SIGNALR REALTIME

  useEffect(() => {

    if (!user) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(
        "https://inventoryapp-cisl.onrender.com/hubs/discussion",
        {
          accessTokenFactory: () => localStorage.getItem("token") || ""
        }
      )
      .withAutomaticReconnect()
      .build()

    connection.on("NewNotification", (notification) => {

      setNotifications(prev => [notification, ...prev])
      setUnreadCount(prev => prev + 1)

    })

    connection.start()

    return () => {
      connection.stop()
    }

  }, [user])


  // GOOGLE LOGIN

  useEffect(() => {

    const buttonDiv = document.getElementById("google-login-button")

    if (!window.google || !buttonDiv) return

    if (user) {
      buttonDiv.innerHTML = ""
      return
    }

    window.google.accounts.id.initialize({
      client_id: "540856577645-5udfep8m5v041b4hvtcakk983qf2ctpc.apps.googleusercontent.com",
      callback: handleCredentialResponse
    })

    buttonDiv.innerHTML = ""

    window.google.accounts.id.renderButton(
      buttonDiv,
      {
        theme: "outline",
        size: "medium",
        width: 220
      }
    )

  }, [user])


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

    } catch (err) {

      console.error("Google login error:", err)

    }

  }


  async function markAsRead(id: string) {

    await fetch(`${API}/notification/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })

  }


  function handleNotificationClick(n: any) {

    markAsRead(n.id)

    setUnreadCount(prev => Math.max(prev - 1, 0))

    setNotifications(prev => prev.filter(x => x.id !== n.id))

    navigate(`/inventories/${n.inventoryId}?tab=discussion`)

  }


  function handleLogout() {

    window.google?.accounts.id.disableAutoSelect()

    logout()

    navigate("/")

  }


  return (

    <div className="border-b bg-white px-6 h-16 flex items-center justify-between">

      <div className="font-bold text-xl text-blue-600 tracking-tight">
        Inventory
      </div>

      <div className="flex items-center gap-4">

        {/* LANGUAGE SWITCH */}

        <button
          onClick={() => i18n.changeLanguage("en")}
          className="text-xs border px-2 py-1 rounded"
        >
          EN
        </button>

        <button
          onClick={() => i18n.changeLanguage("ru")}
          className="text-xs border px-2 py-1 rounded"
        >
          RU
        </button>


        {/* THEME SWITCH */}

        <button
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          className="text-xs border px-2 py-1 rounded"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>


        {/* NOTIFICATIONS */}

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <div className="relative cursor-pointer">

              <Bell className="h-5 w-5 text-muted-foreground"/>

              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                  {unreadCount}
                </span>
              )}

            </div>

          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80">

            <DropdownMenuLabel>
              Notifications
            </DropdownMenuLabel>

            <DropdownMenuSeparator/>

            {notifications.length === 0 && (
              <div className="p-3 text-sm text-gray-500">
                No notifications
              </div>
            )}

            {notifications.map((n, i) => (

              <DropdownMenuItem
                key={i}
                onClick={() => handleNotificationClick(n)}
                className="flex flex-col items-start cursor-pointer"
              >

                <span className="font-semibold">
                  {n.inventoryTitle}
                </span>

                <span className="text-xs text-muted-foreground">
                  {n.message}
                </span>

              </DropdownMenuItem>

            ))}

          </DropdownMenuContent>

        </DropdownMenu>


        {/* GOOGLE LOGIN */}

        {!user && (
          <div className="flex items-center h-10" id="google-login-button"></div>
        )}


        {/* USER MENU */}

        {user && (

          <DropdownMenu>

            <DropdownMenuTrigger asChild>

              <button className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition">

                {user.picture ? (

                  <img
                    src={user.picture}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />

                ) : (

                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user.userName?.[0]?.toUpperCase()}
                  </div>

                )}

                <span className="text-sm font-medium">
                  {user.userName}
                </span>

              </button>

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">

              <DropdownMenuLabel>

                <div className="flex flex-col">

                  <span className="font-semibold">
                    {user.userName}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>

                </div>

              </DropdownMenuLabel>

              <DropdownMenuSeparator/>

              <DropdownMenuItem
                onClick={() => navigate("/profile")}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator/>

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600"
              >
                Logout
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        )}

      </div>

    </div>

  )

}