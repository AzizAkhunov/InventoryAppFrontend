import { useState } from "react"
import UsersTab from "@/components/admin/UsersTab"
import InventoriesTab from "@/components/admin/InventoriesTab"
import { useTranslation } from "react-i18next"

export default function AdminPage(){

 const [tab,setTab]=useState("users")
 const { t } = useTranslation()
 return(

 <div className="p-6 flex flex-col gap-6">

   <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
     {t("adminPanel")}
   </h1>

   <div className="flex gap-3 border-b border-gray-200 dark:border-gray-700 pb-2">

     <button
      onClick={()=>setTab("users")}
      className={`px-4 py-1.5 text-sm rounded-md transition
${tab==="users"
 ? "bg-blue-600 text-white"
 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
}`}
     >
       {t("users")}
     </button>

     <button
      onClick={()=>setTab("inventories")}
      className={`px-4 py-1.5 text-sm rounded-md transition
${tab==="inventories"
 ? "bg-blue-600 text-white"
 : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
}`}
     >
       {t("inventories")}
     </button>

   </div>

   {tab==="users" && <UsersTab/>}
   {tab==="inventories" && <InventoriesTab/>}

 </div>

 )
}