import { BrowserRouter, Routes, Route } from "react-router-dom"

import AppLayout from "./components/layout/AppLayout"
import AuthCallbackPage from "./pages/AuthCallbackPage"
import DashboardPage from "./pages/DashboardPage"
import InventoriesPage from "./pages/InventoriesPage" 
import InventoryPage from "./pages/InventoryPage"
import ProfilePage from "./pages/ProfilePage"
import TagCloudPage from "./pages/TagCloudPage"
import SearchPage from "./pages/SearchPage"
import AdminPage from "./pages/AdminPage"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import AdminRoute from "@/components/auth/AdminRoute"
import LoginPage from "./pages/LoginPage"
import { Toaster } from "sonner"


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
          <Route path="/tags" element={<TagCloudPage/>} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/login" element={<LoginPage />} />



          <Route
  path="/admin"
  element={
    <AdminRoute>
      <AdminPage />
    </AdminRoute>
  }
/>



        </Routes>

      </AppLayout>

      <Toaster position="top-right" />

    </BrowserRouter>

  )

}

export default App