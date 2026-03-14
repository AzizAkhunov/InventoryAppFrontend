import Sidebar from "./SideBar"
import Topbar from "./TopBar"

export default function AppLayout({ children }: any) {

  return (

    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* TOPBAR */}

      <Topbar />

      <div className="flex flex-1">

        {/* SIDEBAR */}

        <Sidebar />

        {/* CONTENT */}

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>

  )

}