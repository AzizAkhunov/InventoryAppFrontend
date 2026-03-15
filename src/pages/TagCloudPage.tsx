import { useEffect, useState, useMemo } from "react"
import { getTagCloud } from "@/api/TagsApi"
import { useNavigate } from "react-router-dom"

type Tag = {
  tag: string
  count: number
}

export default function TagCloudPage(){

const [tags,setTags] = useState<Tag[]>([])
const [search,setSearch] = useState("")
const navigate = useNavigate()

useEffect(()=>{
 loadTags()
},[])

async function loadTags(){
 const res = await getTagCloud()
 setTags(res.data)
}

const filteredTags = useMemo(()=>{
 return tags.filter(t => 
  t.tag.toLowerCase().includes(search.toLowerCase())
 )
},[tags,search])

const topTags = useMemo(()=>{
 return [...tags]
 .sort((a,b)=>b.count-a.count)
 .slice(0,5)
},[tags])

function getSize(count:number){

 if(count > 20) return "text-3xl"
 if(count > 10) return "text-2xl"
 if(count > 5) return "text-xl"

 return "text-lg"
}

function getColor(count:number){

 if(count > 20) return "bg-purple-100 text-purple-700 hover:bg-purple-200"
 if(count > 10) return "bg-blue-100 text-blue-700 hover:bg-blue-200"
 if(count > 5) return "bg-green-100 text-green-700 hover:bg-green-200"

 return "bg-gray-100 text-gray-700 hover:bg-gray-200"
}

function randomRotate(){
 const values = [-6,-4,-2,0,2,4,6]
 return values[Math.floor(Math.random()*values.length)]
}

return(

<div className="flex flex-col gap-10">

<h1 className="text-3xl font-semibold">
Tag Cloud
</h1>

<input
value={search}
onChange={e=>setSearch(e.target.value)}
placeholder="Search tags..."
className="border rounded-lg px-4 py-2 w-full max-w-md"
/>

{tags.length === 0 && (

<div className="flex flex-col items-center justify-center gap-4 py-20 text-center">

<div className="text-6xl">
🏷️
</div>

<h2 className="text-2xl font-semibold text-gray-700">
There are no tags yet
</h2>

<p className="text-gray-500 max-w-md">
Tags will appear here once users start adding items with tags in inventories.
</p>

</div>

)}

{tags.length > 0 && (

<>

<div className="flex flex-col gap-3">

<h2 className="text-xl font-semibold">
Top Tags
</h2>

<div className="flex gap-3 flex-wrap">

{topTags.map(tag=>(

<span
key={tag.tag}
onClick={()=>navigate(`/search?tag=${tag.tag}`)}
className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full cursor-pointer hover:bg-yellow-200 transition flex items-center gap-2"
>

#{tag.tag}

<span className="text-xs opacity-70">
{tag.count}
</span>

</span>

))}

</div>

</div>

<div className="flex flex-wrap gap-4">

{filteredTags.length === 0 && search !== "" && (

<div className="w-full text-center text-gray-500 py-10">
No tags found for "{search}"
</div>

)}

{filteredTags.map(tag=>{

const size = getSize(tag.count)
const color = getColor(tag.count)
const rotate = randomRotate()

return(

<span
key={tag.tag}
style={{transform:`rotate(${rotate}deg)`}}
onClick={() => navigate(`/search?tag=${tag.tag}`)}
className={`${size} ${color} px-4 py-2 rounded-full cursor-pointer transition transform hover:scale-110 flex items-center gap-2`}
>

#{tag.tag}

<span className="text-xs opacity-70">
{tag.count}
</span>

</span>

)

})}

</div>

</>

)}

</div>

)

}