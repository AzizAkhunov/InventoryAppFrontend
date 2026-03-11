import Sidebar from "./SideBar"
import Topbar from "./TopBar"

export default function AppLayout({ children }: any) {

  return (

    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Topbar />

        <main className="p-8">

          {children}

        </main>

      </div>

    </div>

  )

}