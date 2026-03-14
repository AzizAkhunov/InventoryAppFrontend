import {
  LayoutDashboard,
  Boxes,
  MessageSquare,
  Tag,
  Settings
} from "lucide-react"

import { NavLink } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

export default function Sidebar() {

  const { user } = useAuth()

  const menu = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventories", path: "/inventories", icon: Boxes },
    { name: "Tags", path: "/tags", icon: Tag },
  ]

  if (user?.isAdmin) {
    menu.push({ name: "Admin Panel", path: "/admin", icon: MessageSquare })
  }

  return (

    <aside className="w-64 border-r bg-white flex flex-col">

      <nav className="flex flex-col gap-1 p-3">

        {menu.map((item) => {

          const Icon = item.icon

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
                ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-muted-foreground hover:bg-muted"
                }`
              }
            >

              <Icon className="h-4 w-4" />

              {item.name}

            </NavLink>

          )

        })}

      </nav>

    </aside>

  )

}