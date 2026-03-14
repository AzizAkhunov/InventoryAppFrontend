import { useEffect, useState } from "react"
import { getInventories, deleteInventory } from "@/api/AdminApi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

import {
 AlertDialog,
 AlertDialogTrigger,
 AlertDialogContent,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogCancel,
 AlertDialogAction
} from "@/components/ui/alert-dialog"

export default function InventoriesTab(){

 const [inventories,setInventories] = useState<any[]>([])
 const [search,setSearch] = useState("")
 const [page,setPage] = useState(1)

 const navigate = useNavigate()

 const inventoriesPerPage = 6

 useEffect(()=>{
  load()
 },[])

 async function load(){
  const res = await getInventories()
  setInventories(res.data)
 }

 async function handleDelete(id:string){
  await deleteInventory(id)
  load()
 }

 const filteredInventories = inventories.filter(i =>
  i.title.toLowerCase().includes(search.toLowerCase()) ||
  i.owner.toLowerCase().includes(search.toLowerCase())
 )

 const start = (page - 1) * inventoriesPerPage
 const paginatedInventories = filteredInventories.slice(start, start + inventoriesPerPage)

 const totalPages = Math.ceil(filteredInventories.length / inventoriesPerPage)

 return(

 <div className="flex flex-col gap-4">

  {/* SEARCH */}

  <Input
   placeholder="Search inventory..."
   value={search}
   onChange={(e)=>{
    setSearch(e.target.value)
    setPage(1)
   }}
   className="max-w-sm"
  />

  {/* TABLE */}

  <div className="border rounded-xl overflow-hidden">

  <table className="w-full text-sm">

   <thead className="bg-muted">

    <tr className="text-left">

     <th className="p-3">Title</th>
     <th className="p-3">Owner</th>
     <th className="p-3">Public</th>
     <th className="p-3">Actions</th>

    </tr>

   </thead>

   <tbody>

    {paginatedInventories.map(i => (

     <tr key={i.id} className="border-t">

      <td className="p-3 font-medium">
       {i.title}
      </td>

      <td className="p-3 text-muted-foreground">
       {i.owner}
      </td>

      <td className="p-3">

       {i.isPublic ? (

        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
         Public
        </span>

       ) : (

        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
         Private
        </span>

       )}

      </td>

      <td className="p-3 flex gap-2">

       <Button
        size="sm"
        variant="outline"
        onClick={()=>navigate(`/inventories/${i.id}`)}
       >
        Open
       </Button>

       <AlertDialog>

        <AlertDialogTrigger asChild>

         <Button size="sm" variant="destructive">
          Delete
         </Button>

        </AlertDialogTrigger>

        <AlertDialogContent>

         <AlertDialogHeader>

          <AlertDialogTitle>
           Delete Inventory
          </AlertDialogTitle>

          <AlertDialogDescription>
           You are about to permanently delete <b>{i.title}</b>.
           This action cannot be undone.
          </AlertDialogDescription>

         </AlertDialogHeader>

         <AlertDialogFooter>

          <AlertDialogCancel>
           Cancel
          </AlertDialogCancel>

          <AlertDialogAction
           className="bg-red-600 hover:bg-red-700"
           onClick={()=>handleDelete(i.id)}
          >
           Delete
          </AlertDialogAction>

         </AlertDialogFooter>

        </AlertDialogContent>

       </AlertDialog>

      </td>

     </tr>

    ))}

   </tbody>

  </table>

  </div>

  {/* PAGINATION */}

  <div className="flex items-center gap-3">

   <Button
    size="sm"
    disabled={page === 1}
    onClick={()=>setPage(p=>p-1)}
   >
    Prev
   </Button>

   <span className="text-sm">
    Page {page} / {totalPages || 1}
   </span>

   <Button
    size="sm"
    disabled={page === totalPages}
    onClick={()=>setPage(p=>p+1)}
   >
    Next
   </Button>

  </div>

 </div>

 )
}