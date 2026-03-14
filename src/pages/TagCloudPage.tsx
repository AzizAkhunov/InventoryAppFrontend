import { useEffect, useState } from "react"
import { getTagCloud } from "@/api/TagsApi"
import { useNavigate } from "react-router-dom"

type Tag = {
  tag: string
  count: number
}

export default function TagCloudPage(){

const [tags,setTags] = useState<Tag[]>([])
const navigate = useNavigate()

useEffect(()=>{
 loadTags()
},[])

async function loadTags(){

 const res = await getTagCloud()

 setTags(res.data)

}

return(

<div className="flex flex-col gap-8">

<h1 className="text-3xl font-semibold">
Tag Cloud
</h1>

<div className="flex flex-wrap gap-4">

{tags.map(tag=>{

const size =
tag.count > 10 ? "text-2xl"
: tag.count > 5 ? "text-xl"
: "text-lg"

return(

<span
key={tag.tag}
onClick={() => navigate(`/search?tag=${tag.tag}`)}
className={`${size} px-4 py-2 bg-blue-100 text-blue-700 rounded-full cursor-pointer hover:bg-blue-200`}
>

#{tag.tag}

</span>

)

})}

</div>

</div>

)

}