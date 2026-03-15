import { useState } from "react"
import UsersTab from "@/components/admin/UsersTab"
import StatsTab from "@/components/admin/StatsTab"
import InventoriesTab from "@/components/admin/InventoriesTab"
import { useTranslation } from "react-i18next"

export default function AdminPage(){

 const [tab,setTab]=useState("users")
 const { t } = useTranslation()
 return(

 <div className="p-6 flex flex-col gap-6">

   <h1 className="text-3xl font-semibold">
     {t("adminPanel")}
   </h1>

   <div className="flex gap-3 border-b pb-2">

     <button
      onClick={()=>setTab("users")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="users"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       {t("users")}
     </button>

     <button
      onClick={()=>setTab("inventories")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="inventories"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       {t("inventories")}
     </button>

     <button
      onClick={()=>setTab("stats")}
      className={`px-3 py-1 text-sm rounded ${
       tab==="stats"?"bg-blue-600 text-white":"bg-muted"
      }`}
     >
       {t("stats")}
     </button>

   </div>

   {tab==="users" && <UsersTab/>}
   {tab==="inventories" && <InventoriesTab/>}
   {tab==="stats" && <StatsTab/>}

 </div>

 )
}