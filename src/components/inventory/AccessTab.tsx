import { useEffect,useState } from "react"
import {
getAccessList,
addAccess,
removeAccess,
searchUsers
} from "@/api/InventoryAccessApi"

type User = {
 id:string
 userName:string
 email:string
}

export default function AccessTab({inventoryId}:{inventoryId:string}){

const [users,setUsers] = useState<User[]>([])
const [query,setQuery] = useState("")
const [suggestions,setSuggestions] = useState<User[]>([])
const [selected,setSelected] = useState<User | null>(null)
const [ownerId,setOwnerId] = useState<string>("")

useEffect(()=>{
 if(inventoryId){
  loadAccess()
 }
},[inventoryId])

async function loadAccess(){

 const res = await getAccessList(inventoryId)

 setUsers(res.data)
 setOwnerId(res.data[0]?.id)

}

async function handleSearch(value:string){

 setQuery(value)

 if(value.length < 2){
  setSuggestions([])
  return
 }

 const res = await searchUsers(value)

 setSuggestions(res.data)

}

async function handleAdd(){

 if(!selected) return

 await addAccess(inventoryId,selected.id)

 setQuery("")
 setSelected(null)
 setSuggestions([])

 loadAccess()

}

async function handleRemove(id:string){

 await removeAccess(inventoryId,id)

 loadAccess()

}

return(

<div className="flex flex-col gap-6 w-[600px]">

<h2 className="text-xl font-semibold">
Share Inventory
</h2>

<div className="flex flex-col gap-2">

<input
value={query}
onChange={e=>handleSearch(e.target.value)}
placeholder="Search user by email"
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>

{suggestions.length > 0 && (

<div className="border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 shadow-sm">

{suggestions.map(u => (

<div
key={u.id}
onClick={()=>{
 setSelected(u)
 setQuery(u.email)
 setSuggestions([])
}}
className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer text-gray-900 dark:text-gray-100"
>

{u.email}

</div>

))}

</div>

)}

</div>

<button
onClick={handleAdd}
className="bg-blue-600 text-white px-4 py-2 rounded w-fit"
>

Add Access

</button>

<div className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">

<table className="w-full">

<thead className="bg-gray-50 dark:bg-gray-800">

<tr>

<th className="p-2 text-left text-gray-700 dark:text-gray-300">
User
</th>

<th></th>

</tr>

</thead>

<tbody>

{users.map(u => (

<tr key={u.id} className="border-t border-gray-200 dark:border-gray-700">

<td className="p-2">
<div className="font-medium">
{u.userName}
</div>

<div className="text-sm text-gray-500 dark:text-gray-400">
{u.email}
</div>
</td>

<td>

{u.id === ownerId ? (
<span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
Owner
</span>
) : (

<button
onClick={()=>handleRemove(u.id)}
className="text-red-500 hover:text-red-700"
>
Remove
</button>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

)

}