import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUsers } from "@/api/UsersApi"

type User = {
  id: string
  userName: string
  email: string
  isAdmin: boolean
  isBlocked: boolean
}

export default function ProfilePage() {

  const { user } = useAuth()

  const [profile, setProfile] = useState<User | null>(null)

  useEffect(() => {

    async function loadUser() {

      const res = await getUsers()

      const currentUser = res.data.find(
        (u: User) => u.id === user?.id
      )

      setProfile(currentUser)

    }

    loadUser()

  }, [user])

  if (!profile) return null

  return (

    <div className="max-w-[800px] mx-auto flex flex-col gap-8">

      <h1 className="text-3xl font-semibold">
        Profile
      </h1>

      {/* PROFILE CARD */}

      <div className="border rounded-xl p-6 flex gap-6 items-center bg-white shadow-sm">

        {/* AVATAR */}

        <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-semibold">
          {profile.userName.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-1">

          <span className="text-xl font-semibold">
            {profile.userName}
          </span>

          <span className="text-gray-500">
            {profile.email}
          </span>

        </div>

      </div>

      {/* INFO GRID */}

      <div className="grid grid-cols-2 gap-6">

        <div className="border rounded-xl p-4 bg-white shadow-sm">

          <p className="text-sm text-gray-500">
            Role
          </p>

          <p className="font-semibold">
            {profile.isAdmin ? "Admin" : "User"}
          </p>

        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm">

          <p className="text-sm text-gray-500">
            Blocked
          </p>

          <p className="font-semibold">
            {profile.isBlocked ? "Yes" : "No"}
          </p>

        </div>

        <div className="border rounded-xl p-4 bg-white shadow-sm">

          <p className="text-sm text-gray-500">
            User ID
          </p>

          <p className="font-semibold text-xs break-all">
            {profile.id}
          </p>

        </div>

      </div>

    </div>

  )
}