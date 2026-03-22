import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { getUsers } from "@/api/UsersApi"
import { createSalesforceAccount } from "@/api/SalesforceApi"
import { toast } from "sonner"


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

  const [open, setOpen] = useState(false)


  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    website: ""
  })



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

useEffect(() => {
  if (profile) {
    const [firstName, lastName] = profile.userName.split(" ")

    setForm(prev => ({
      ...prev,
      firstName: firstName || "",
      lastName: lastName || ""
    }))
  }
}, [profile])
  

  if (!profile) return null

const handleSubmit = async () => {
  try {
    await createSalesforceAccount({
      ...form,
      email: profile.email
    })

    toast.success("Salesforce sent!")

    setForm({
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      website: ""
    })


    setOpen(false)

  } catch (e) {
    console.error(e)
    toast.error("FirstName and Company are required")
  }
}



  return (

    <div className="max-w-[800px] mx-auto flex flex-col gap-8">

      <h1 className="text-3xl font-semibold">
        Profile
      </h1>

      {/* PROFILE CARD */}

      {user?.id === profile.id && (
  <button
    onClick={() => setOpen(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg w-fit"
  >
    Add to CRM
  </button>
)}

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
{open && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div className="bg-white p-6 rounded-xl w-[400px] flex flex-col gap-3">

      <h2 className="text-lg font-semibold">CRM Data</h2>

      <input
        placeholder="First Name"
        onChange={e => setForm({ ...form, firstName: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Last Name"
        onChange={e => setForm({ ...form, lastName: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Company"
        onChange={e => setForm({ ...form, company: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Phone"
        onChange={e => setForm({ ...form, phone: e.target.value })}
        className="border p-2 rounded"
      />

      <input
        placeholder="Website"
        onChange={e => setForm({ ...form, website: e.target.value })}
        className="border p-2 rounded"
      />

      <div className="flex justify-end gap-2 mt-2">
        <button onClick={() => setOpen(false)}>Cancel</button>
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Submit
        </button>
      </div>

    </div>
  </div>
)}
    </div>
    

  )
}