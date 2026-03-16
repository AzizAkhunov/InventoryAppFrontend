import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import {
  getUsers,
  makeAdmin,
  blockUser,
  unblockUser,
  deleteUser
} from "@/api/AdminApi"
import { useTranslation } from "react-i18next"

type User = {
  id: string
  userName: string
  email: string
  isAdmin: boolean
  isBlocked: boolean
}

export default function UsersTab() {

  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const usersPerPage = 8

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    const res = await getUsers()
    setUsers(res.data)
  }

  async function handleMakeAdmin(id: string) {
    await makeAdmin(id)
    loadUsers()
  }

async function handleDeleteUser(id: string){

await deleteUser(id)

setUsers(prev => prev.filter(u => u.id !== id))

}


  async function handleBlock(id: string) {
    await blockUser(id)
    loadUsers()
  }

  async function handleUnblock(id: string) {
    await unblockUser(id)
    loadUsers()
  }

  const filteredUsers = users.filter(u =>
    u.userName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const { t } = useTranslation()
  const totalUsers = users.length
  const totalAdmins = users.filter(u => u.isAdmin).length
  const totalBlocked = users.filter(u => u.isBlocked).length

  const start = (page - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(start, start + usersPerPage)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  return (

    <div className="p-4 flex flex-col gap-4">

      <h1 className="text-3xl font-semibold">
        {t("adminPanel")}
      </h1>

      {/* STATS */}

      <div className="flex gap-4">

        <div className="bg-muted px-4 py-2 rounded-lg text-sm">
          {t("users")}: <b>{totalUsers}</b>
        </div>

        <div className="bg-muted px-4 py-2 rounded-lg text-sm">
          {t("admins")}: <b>{totalAdmins}</b>
        </div>

        <div className="bg-muted px-4 py-2 rounded-lg text-sm">
          {t("blocked")}: <b>{totalBlocked}</b>
        </div>

      </div>

      {/* SEARCH */}

      <Input
        placeholder={t("searchUser")}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setPage(1)
        }}
        className="max-w-sm"
      />

      {/* TABLE */}

      <div className="border rounded-xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-muted">

            <tr className="text-left">

              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {paginatedUsers.map(user => (

              <tr
                key={user.id}
                className="border-t cursor-pointer hover:bg-muted/40"
                onClick={() => setSelectedUser(user)}
              >

                <td className="p-3 font-medium">
                  {user.userName}
                </td>

                <td className="p-3 text-muted-foreground">
                  {user.email}
                </td>

                <td className="p-3">

                  {user.isAdmin ? (

                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                      Admin
                    </span>

                  ) : (

                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                      User
                    </span>

                  )}

                </td>

                <td className="p-3">

                  {user.isBlocked ? (

                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                      Blocked
                    </span>

                  ) : (

                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                      Active
                    </span>

                  )}

                </td>

                <td
                  className="p-3 flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >

                  {!user.isAdmin && (

                    <Button
                      size="sm"
                      onClick={() => handleMakeAdmin(user.id)}
                    >
                      {t("makeAdmin")}
                    </Button>

                  )}

                  {user.isBlocked ? (

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUnblock(user.id)}
                    >
                      {t("unblock")}
                    </Button>

                  ) : (

                    <Button
size="sm"
variant="outline"
className="text-orange-600 border-orange-300 hover:bg-orange-50"
onClick={() => handleBlock(user.id)}
>
{t("block")}
</Button>

                  )}

<AlertDialog>

<AlertDialogTrigger asChild>

<Button
size="sm"
variant="destructive"
>
{t("delete")}
</Button>

</AlertDialogTrigger>

<AlertDialogContent>

<AlertDialogHeader>

<AlertDialogDescription>
{t("deleteUser")}
</AlertDialogDescription>

</AlertDialogHeader>

<AlertDialogFooter>

<AlertDialogCancel>
{t("cancel")}
</AlertDialogCancel>

<AlertDialogAction
onClick={() => handleDeleteUser(user.id)}
className="bg-red-600 hover:bg-red-700"
>

{t("delete")}

</AlertDialogAction>

</AlertDialogFooter>

</AlertDialogContent>

</AlertDialog>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* PAGINATION */}

      <div className="flex gap-2 items-center">

        <Button
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          {t("prev")}
        </Button>

        <span className="text-sm">
          {t("page")} {page} / {totalPages || 1}
        </span>

        <Button
          size="sm"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          {t("next")}
        </Button>

      </div>

      {/* USER MODAL */}

      {selectedUser && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white rounded-xl p-6 w-[400px] flex flex-col gap-3">

            <h2 className="text-lg font-semibold">
              {t("profileUser")}
            </h2>

            <div className="text-sm">
              <b>Username:</b> {selectedUser.userName}
            </div>

            <div className="text-sm">
              <b>Email:</b> {selectedUser.email}
            </div>

            <div className="text-sm">
              <b>Admin:</b> {selectedUser.isAdmin ? "Yes" : "No"}
            </div>

            <div className="text-sm">
              <b>Blocked:</b> {selectedUser.isBlocked ? "Yes" : "No"}
            </div>

            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
            >
              {t("close")}
            </Button>

          </div>

        </div>

      )}

    </div>

  )
}