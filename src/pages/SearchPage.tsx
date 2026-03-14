import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { getInventoriesByTag } from "@/api/InventoryApi"

type Inventory = {
  id: string
  title: string
  description?: string
  imageUrl?: string
}

export default function SearchPage() {

  const [searchParams] = useSearchParams()
  const tag = searchParams.get("tag")

  const [inventories,setInventories] = useState<Inventory[]>([])

  const navigate = useNavigate()

  useEffect(()=>{

    if(tag){
      load()
    }

  },[tag])

  async function load(){

    const res = await getInventoriesByTag(tag!)

    setInventories(res.data)

  }

  return(

<div className="flex flex-col gap-6">

<h1 className="text-3xl font-semibold">

Results for #{tag}

</h1>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{inventories.map(inv => (

<div
key={inv.id}
onClick={()=>navigate(`/inventories/${inv.id}`)}
className="border rounded-xl p-4 cursor-pointer hover:shadow-lg"
>

<div className="font-semibold text-lg">
{inv.title}
</div>

<div className="text-sm text-gray-500">
{inv.description}
</div>

</div>

))}

</div>

</div>

)

}