import Sidebar from "./SideBar"
import Topbar from "./TopBar"

export default function AppLayout({ children }: any) {

  return (

    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      <Topbar />

      <div className="flex flex-1">

        <Sidebar />

        <main className="flex-1 p-8">
          {children}
        </main>

      </div>

    </div>

  )

}