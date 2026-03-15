import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
Card,
CardContent,
CardHeader,
CardTitle
} from "@/components/ui/card"

import { useNavigate } from "react-router-dom"
import { Plus, Search, Boxes, X } from "lucide-react"

import { useState, useEffect } from "react"

import {
getInventories,
createInventory,
getMyInventories,
getSharedInventories
} from "@/api/InventoryApi"

import { useAuth } from "@/context/AuthContext"


export default function InventoriesPage() {

const navigate = useNavigate()
const { user } = useAuth()

const [search, setSearch] = useState("")
const [open, setOpen] = useState(false)

const [mode, setMode] = useState<"all" | "my" | "shared">("all")

const [inventories, setInventories] = useState<any[]>([])

const [activeTab, setActiveTab] = useState("general")

const [title, setTitle] = useState("")
const [description, setDescription] = useState("")
const [imageUrl, setImageUrl] = useState("")
const [category, setCategory] = useState("")
const [tags, setTags] = useState("")
const [isPublic, setIsPublic] = useState(false)

const [fields, setFields] = useState({

customString1Enabled: false,
customString1Name: "",

customString2Enabled: false,
customString2Name: "",

customString3Enabled: false,
customString3Name: "",

customNumber1Enabled: false,
customNumber1Name: "",

customNumber2Enabled: false,
customNumber2Name: "",

customNumber3Enabled: false,
customNumber3Name: "",

customBool1Enabled: false,
customBool1Name: "",

customBool2Enabled: false,
customBool2Name: "",

customBool3Enabled: false,
customBool3Name: ""

})


useEffect(() => {

async function loadInventories() {

if (mode === "all") {

const res = await getInventories()
setInventories(res.data)

}

if (mode === "my") {

const res = await getMyInventories()
setInventories(res.data)

}

if (mode === "shared") {

const res = await getSharedInventories()
setInventories(res.data)

}

}

loadInventories()

}, [mode])


let filteredInventories = inventories

filteredInventories = filteredInventories.filter((inv) =>
(inv.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
(inv.categoryName?.toLowerCase() || "").includes(search.toLowerCase())
)


function updateField(name: string, value: any) {

setFields(prev => ({
...prev,
[name]: value
}))

}


async function handleCreate() {

if (!title || !category) {
alert("Title and Category are required")
return
}

const data = {

title,
description,
imageUrl,
isPublic,
categoryName: category,
tags: tags ? tags.split(",").map(t => t.trim()) : [],

customString1Enabled: !!fields.customString1Name,
customString1Name: fields.customString1Name,

customString2Enabled: !!fields.customString2Name,
customString2Name: fields.customString2Name,

customString3Enabled: !!fields.customString3Name,
customString3Name: fields.customString3Name,

customNumber1Enabled: !!fields.customNumber1Name,
customNumber1Name: fields.customNumber1Name,

customNumber2Enabled: !!fields.customNumber2Name,
customNumber2Name: fields.customNumber2Name,

customNumber3Enabled: !!fields.customNumber3Name,
customNumber3Name: fields.customNumber3Name,

customBool1Enabled: !!fields.customBool1Name,
customBool1Name: fields.customBool1Name,

customBool2Enabled: !!fields.customBool2Name,
customBool2Name: fields.customBool2Name,

customBool3Enabled: !!fields.customBool3Name,
customBool3Name: fields.customBool3Name

}

try {

const res = await createInventory(data)

setInventories(prev => [...prev, res.data])

setTitle("")
setDescription("")
setImageUrl("")
setCategory("")
setTags("")
setIsPublic(false)

setFields({

customString1Enabled: false,
customString1Name: "",

customString2Enabled: false,
customString2Name: "",

customString3Enabled: false,
customString3Name: "",

customNumber1Enabled: false,
customNumber1Name: "",

customNumber2Enabled: false,
customNumber2Name: "",

customNumber3Enabled: false,
customNumber3Name: "",

customBool1Enabled: false,
customBool1Name: "",

customBool2Enabled: false,
customBool2Name: "",

customBool3Enabled: false,
customBool3Name: ""

})

setOpen(false)

} catch (err) {

console.error(err)
alert("Failed to create inventory")

}

}



return (

<div className="flex flex-col gap-6">


<div className="flex items-center justify-between">

<h1 className="text-3xl font-semibold">
Inventories
</h1>

<Button
className="bg-blue-600 hover:bg-blue-700"
onClick={() => setOpen(true)}
>

<Plus className="w-4 h-4 mr-2"/>
Create Inventory

</Button>

</div>


<div className="flex items-center justify-between">

<div className="flex gap-2">

<Button
variant={mode === "all" ? "default" : "outline"}
onClick={() => setMode("all")}
>
All
</Button>

<Button
variant={mode === "my" ? "default" : "outline"}
onClick={() => setMode("my")}
>
My Inventories
</Button>

<Button
variant={mode === "shared" ? "default" : "outline"}
onClick={() => setMode("shared")}
>
Shared With Me
</Button>

</div>

<div className="flex items-center gap-3">

<Search className="w-4 h-4 text-muted-foreground"/>

<Input
placeholder="Search inventories..."
className="max-w-sm"
value={search}
onChange={(e) => setSearch(e.target.value)}
/>

</div>

</div>


{filteredInventories.length === 0 ? (

<div className="flex flex-col items-center justify-center py-20 text-center gap-4">

<Boxes className="w-16 h-16 text-gray-300"/>

<h3 className="text-xl font-semibold">
No inventories found
</h3>

<p className="text-muted-foreground max-w-sm">
You don't have any inventories yet or nothing matches your search.
Create your first inventory to start managing items.
</p>

<Button
className="bg-blue-600 hover:bg-blue-700"
onClick={() => setOpen(true)}
>

<Plus className="w-4 h-4 mr-2"/>
Create Inventory

</Button>

</div>

) : (

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

{filteredInventories.map((inv) => (

<Card
key={inv.id}
className="hover:shadow-xl transition cursor-pointer overflow-hidden"
onClick={() => navigate(`/inventories/${inv.id}`)}
>

{inv.imageUrl ? (

<img
src={inv.imageUrl}
className="w-full h-40 object-cover"
/>

) : (

<div className="w-full h-40 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
{inv.title?.charAt(0)}
</div>

)}

<CardHeader className="flex flex-row items-center gap-3">

<Boxes className="text-blue-600"/>

<CardTitle className="text-lg">
{inv.title}
</CardTitle>

</CardHeader>

<CardContent className="flex justify-between text-sm text-muted-foreground">

<span>
{inv.itemsCount ?? 0} items
</span>

<span>
{inv.categoryName}
</span>

</CardContent>

</Card>

))}

</div>

)}



{open && (

<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

<div className="bg-white p-6 rounded-xl w-[700px] max-h-[90vh] overflow-y-auto flex flex-col gap-6">


<div className="flex items-center justify-between">

<h2 className="text-xl font-semibold">
Create Inventory
</h2>

<button
onClick={() => setOpen(false)}
className="p-1 hover:bg-gray-100 rounded"
>
<X className="w-5 h-5"/>
</button>

</div>


<div className="flex gap-3 border-b pb-2">

<button
onClick={() => setActiveTab("general")}
className={`px-4 py-2 rounded-md text-sm ${
activeTab === "general"
? "bg-blue-600 text-white"
: "hover:bg-gray-100"
}`}
>
General
</button>

<button
onClick={() => setActiveTab("fields")}
className={`px-4 py-2 rounded-md text-sm ${
activeTab === "fields"
? "bg-blue-600 text-white"
: "hover:bg-gray-100"
}`}
>
Fields
</button>

</div>


{activeTab === "general" && (

<div className="flex flex-col gap-4">

<Input
placeholder="Title"
value={title}
onChange={(e) => setTitle(e.target.value)}
/>

<Input
placeholder="Description"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>

<Input
placeholder="Image Url"
value={imageUrl}
onChange={(e) => setImageUrl(e.target.value)}
/>

<select
className="border rounded-md p-2"
value={category}
onChange={(e) => setCategory(e.target.value)}
>
<option value="">Select category</option>
<option value="Equipment">Equipment</option>
<option value="Furniture">Furniture</option>
<option value="Books">Books</option>
<option value="Other">Other</option>
</select>

<Input
placeholder="Tags (comma separated)"
value={tags}
onChange={(e) => setTags(e.target.value)}
/>

<div className="flex items-center gap-2">

<input
type="checkbox"
checked={isPublic}
onChange={(e) => setIsPublic(e.target.checked)}
/>

<span>Public Inventory</span>

</div>

</div>

)}


{activeTab === "fields" && (

<div className="flex flex-col gap-4">

<p className="text-sm text-muted-foreground">
Custom fields for items
</p>

<div className="grid grid-cols-2 gap-3">


<Input
placeholder="String field 1 name"
value={fields.customString1Name}
onChange={(e)=>updateField("customString1Name",e.target.value)}
/>

<Input
placeholder="String field 2 name"
value={fields.customString2Name}
onChange={(e)=>updateField("customString2Name",e.target.value)}
/>

<Input
placeholder="String field 3 name"
value={fields.customString3Name}
onChange={(e)=>updateField("customString3Name",e.target.value)}
/>


<Input
placeholder="Number field 1 name"
value={fields.customNumber1Name}
onChange={(e)=>updateField("customNumber1Name",e.target.value)}
/>

<Input
placeholder="Number field 2 name"
value={fields.customNumber2Name}
onChange={(e)=>updateField("customNumber2Name",e.target.value)}
/>

<Input
placeholder="Number field 3 name"
value={fields.customNumber3Name}
onChange={(e)=>updateField("customNumber3Name",e.target.value)}
/>


<Input
placeholder="Boolean field 1 name"
value={fields.customBool1Name}
onChange={(e)=>updateField("customBool1Name",e.target.value)}
/>

<Input
placeholder="Boolean field 2 name"
value={fields.customBool2Name}
onChange={(e)=>updateField("customBool2Name",e.target.value)}
/>

<Input
placeholder="Boolean field 3 name"
value={fields.customBool3Name}
onChange={(e)=>updateField("customBool3Name",e.target.value)}
/>

</div>

</div>

)}


<div className="flex gap-3 mt-4">

<Button
className="bg-blue-600 hover:bg-blue-700"
onClick={handleCreate}
>
Create
</Button>

<Button
variant="outline"
onClick={() => setOpen(false)}
>
Cancel
</Button>

</div>

</div>

</div>

)}

</div>

)

}