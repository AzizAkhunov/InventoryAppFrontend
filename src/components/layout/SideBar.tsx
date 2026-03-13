import {
  LayoutDashboard,
  Boxes,
  MessageSquare,
  Tag,
  Settings
} from "lucide-react"

import { NavLink } from "react-router-dom"

const menu = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Inventories", path: "/inventories", icon: Boxes },
  { name: "Tags", path: "/tags", icon: Tag },
  {name: "Users", path: "/users", icon: MessageSquare },
  { name: "Settings", path: "/settings", icon: Settings }
]

export default function Sidebar() {

  return (

    <aside className="w-64 border-r bg-white h-screen flex flex-col">

      {/* LOGO */}

      <div className="p-6 font-semibold text-xl border-b text-blue-600">
        Inventory
      </div>


      {/* MENU */}

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

              <Icon className="h-4 w-4"/>

              {item.name}

            </NavLink>

          )

        })}

      </nav>

    </aside>

  )

}