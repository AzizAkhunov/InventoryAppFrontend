import { useState } from "react"
import UsersTab from "@/components/admin/UsersTab"
import StatsTab from "@/components/admin/StatsTab"
import InventoriesTab from "@/components/admin/InventoriesTab"

export default function AdminPage(){

 const [tab,setTab]=useState("users")

 return(

 <div className="p-6 flex flex-col gap-6">

   <h1 className="text-3xl font-semibold">
     Admin Panel
   </h1>

   <div className="flex gap-3 border-b pb-2">

     <button
      onClick={()=>setTab("users")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="users"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       Users
     </button>

     <button
      onClick={()=>setTab("inventories")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="inventories"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       Inventories
     </button>

     <button
      onClick={()=>setTab("stats")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="stats"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       Statistics
     </button>

   </div>

   {tab==="users" && <UsersTab/>}
   {tab==="inventories" && <InventoriesTab/>}
   {tab==="stats" && <StatsTab/>}

 </div>

 )
}