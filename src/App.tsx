import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"
import AuthCallbackPage from "./pages/AuthCallbackPage"
import DashboardPage from "./pages/DashboardPage"
import InventoriesPage from "./pages/InventoriesPage" 
import InventoryPage from "./pages/InventoryPage"
import ProfilePage from "./pages/ProfilePage"
function App() {

  return (

    <BrowserRouter>

      <AppLayout>

        <Routes>

          <Route path="/" element={<DashboardPage />} />
          <Route path="/inventories" element={<InventoriesPage />} />
          <Route path="/inventories/:id" element={<InventoryPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>

      </AppLayout>

    </BrowserRouter>

  )

}

export default App