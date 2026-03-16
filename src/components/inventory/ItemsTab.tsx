import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

import { useTranslation } from "react-i18next"
import { Heart } from "lucide-react"
import { toggleLike } from "@/api/ItemsApi"
import { useAuth } from "@/context/AuthContext"

import {
Dialog,
DialogContent,
DialogHeader,
DialogTitle,
DialogFooter
} from "@/components/ui/dialog"

import {
getItems,
createItem,
deleteItem
} from "@/api/ItemsApi"

import { getInventoryById } from "@/api/InventoryApi"

import {
Table,
TableBody,
TableCell,
TableHead,
TableHeader,
TableRow
} from "@/components/ui/table"

import { Plus, Trash } from "lucide-react"



type Item = {
id: string
customId: string
likesCount: number
likedByMe: boolean

text1?: string
text2?: string
text3?: string

multiText1?: string
multiText2?: string
multiText3?: string

number1?: number | null
number2?: number | null
number3?: number | null

bool1?: boolean | null
bool2?: boolean | null
bool3?: boolean | null

doc1?: string
doc2?: string
doc3?: string
}

type Inventory = {
customString1Enabled: boolean
customString1Name?: string
customString2Enabled: boolean
customString2Name?: string
customString3Enabled: boolean
customString3Name?: string

customNumber1Enabled: boolean
customNumber1Name?: string
customNumber2Enabled: boolean
customNumber2Name?: string
customNumber3Enabled: boolean
customNumber3Name?: string

customBool1Enabled: boolean
customBool1Name?: string
customBool2Enabled: boolean
customBool2Name?: string
customBool3Enabled: boolean
customBool3Name?: string
}

type Props = {
inventoryId: string
}

export default function ItemsTab({ inventoryId }: Props) {

const { t } = useTranslation()
const [items, setItems] = useState<Item[]>([])
const [inventory, setInventory] = useState<Inventory | null>(null)
const [loginMessage, setLoginMessage] = useState(false)
const [selected, setSelected] = useState<string[]>([])
const [search, setSearch] = useState("")
const { user } = useAuth()
const [openAdd, setOpenAdd] = useState(false)

const [text1, setText1] = useState("")
const [text2, setText2] = useState("")
const [text3, setText3] = useState("")

const [multiText1,setMultiText1] = useState("")
const [multiText2,setMultiText2] = useState("")
const [multiText3,setMultiText3] = useState("")

const [number1, setNumber1] = useState("")
const [number2, setNumber2] = useState("")
const [number3, setNumber3] = useState("")

const [bool1, setBool1] = useState(false)
const [bool2, setBool2] = useState(false)
const [bool3, setBool3] = useState(false)

const [doc1,setDoc1] = useState("")
const [doc2,setDoc2] = useState("")
const [doc3,setDoc3] = useState("")

const filteredItems = items.filter(item =>
(item.customId ?? "").toLowerCase().includes(search.toLowerCase()) ||
(item.text1 ?? "").toLowerCase().includes(search.toLowerCase())
)

function toggleSelectAll() {

if (selected.length === filteredItems.length) {
setSelected([])
} else {
setSelected(filteredItems.map(i => i.id))
}
}

function toggleSelect(id: string) {

if (selected.includes(id)) {
setSelected(selected.filter(i => i !== id))
} else {
setSelected([...selected, id])
}

}

async function deleteSelected() {

for (const id of selected) {
await deleteItem(id)
}

setItems(items.filter(item => !selected.includes(item.id)))
setSelected([])

}

async function addItem() {

const data = {
inventoryId,

text1,
text2,
text3,

multiText1,
multiText2,
multiText3,

doc1,
doc2,
doc3,

number1: number1 ? Number(number1) : null,
number2: number2 ? Number(number2) : null,
number3: number3 ? Number(number3) : null,

bool1,
bool2,
bool3
}

const res = await createItem(data)

setItems([...items, res.data])

resetForm()

setOpenAdd(false)

}



async function likeItem(itemId: string){

try{

const res = await toggleLike(itemId)

const { likesCount, likedByMe } = res.data

setItems(prev =>
prev.map(i =>
i.id === itemId
? { ...i, likesCount, likedByMe }
: i
)
)

}catch(err:any){

if(err.response?.status === 401){
setLoginMessage(true)

setTimeout(()=>{
setLoginMessage(false)
},2500)
return
}

console.error(err)

}

}


function resetForm() {

setText1("")
setText2("")
setText3("")

setMultiText1("")
setMultiText2("")
setMultiText3("")

setNumber1("")
setNumber2("")
setNumber3("")

setBool1(false)
setBool2(false)
setBool3(false)

setDoc1("")
setDoc2("")
setDoc3("")

}

useEffect(() => {

async function loadData() {

const itemsRes = await getItems(inventoryId)
setItems(itemsRes.data)

const invRes = await getInventoryById(inventoryId)
setInventory(invRes.data)

}




loadData()

}, [inventoryId])

return (

<div className="flex flex-col gap-8 items-center">
{loginMessage && (
<div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black text-white px-6 py-3 rounded-xl shadow-lg text-sm">
🔒 Please login to like items
</div>
)}  
<div className="flex justify-between w-[1200px]">

<h2 className="text-3xl font-semibold">
{t("items")}
</h2>

<div className="flex gap-4">

{user && (
<Button
className="bg-blue-600 hover:bg-blue-700"
onClick={() => setOpenAdd(true)}
>
<Plus className="w-4 h-4 mr-2"/>
{t("addItem")}
</Button>
)}

{selected.length > 0 && (

<Button
variant="destructive"
onClick={deleteSelected}
>
<Trash className="w-4 h-4 mr-2"/>
{t("delete")}
</Button>

)}

</div>

</div>

<div className="w-[1200px]">

<input
type="text"
placeholder={t("searchItems")}
value={search}
onChange={(e) => setSearch(e.target.value)}
className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500"
/>

</div>

<div className="w-[1200px] h-[400px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-xl overflow-y-auto">

<Table className="text-gray-900 dark:text-gray-100">

<TableHeader className="bg-gray-100 dark:bg-gray-800">

<TableRow className="border-b border-gray-300 dark:border-gray-700">

<TableHead className="text-gray-800 dark:text-gray-100 font-semibold">

<input
type="checkbox"
checked={
filteredItems.length > 0 &&
selected.length === filteredItems.length
}
onChange={toggleSelectAll}
/>

</TableHead>
<TableHead>Custom ID</TableHead>

{inventory?.customString1Enabled && <TableHead>{inventory.customString1Name}</TableHead>}
{inventory?.customString2Enabled && <TableHead>{inventory.customString2Name}</TableHead>}
{inventory?.customString3Enabled && <TableHead>{inventory.customString3Name}</TableHead>}

{inventory?.customNumber1Enabled && <TableHead>{inventory.customNumber1Name}</TableHead>}
{inventory?.customNumber2Enabled && <TableHead>{inventory.customNumber2Name}</TableHead>}
{inventory?.customNumber3Enabled && <TableHead>{inventory.customNumber3Name}</TableHead>}

{inventory?.customBool1Enabled && <TableHead>{inventory.customBool1Name}</TableHead>}
{inventory?.customBool2Enabled && <TableHead>{inventory.customBool2Name}</TableHead>}
{inventory?.customBool3Enabled && <TableHead>{inventory.customBool3Name}</TableHead>}

<TableHead>❤️</TableHead>

</TableRow>

</TableHeader>

<TableBody>

{filteredItems.map(item => (

<TableRow key={item.id} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">

<TableCell>
<input
type="checkbox"
checked={selected.includes(item.id)}
onChange={() => toggleSelect(item.id)}
/>
</TableCell>

<TableCell className="font-mono">
{item.customId}
</TableCell>

{inventory?.customString1Enabled && <TableCell>{item.text1 ?? "-"}</TableCell>}
{inventory?.customString2Enabled && <TableCell>{item.text2 ?? "-"}</TableCell>}
{inventory?.customString3Enabled && <TableCell>{item.text3 ?? "-"}</TableCell>}

{inventory?.customNumber1Enabled && <TableCell>{item.number1 ?? "-"}</TableCell>}
{inventory?.customNumber2Enabled && <TableCell>{item.number2 ?? "-"}</TableCell>}
{inventory?.customNumber3Enabled && <TableCell>{item.number3 ?? "-"}</TableCell>}

{inventory?.customBool1Enabled && <TableCell>{item.bool1 ? t("true") : t("false")}</TableCell>}
{inventory?.customBool2Enabled && <TableCell>{item.bool2 ? t("true") : t("false")}</TableCell>}
{inventory?.customBool3Enabled && <TableCell>{item.bool3 ? t("true") : t("false")}</TableCell>}

<TableCell>

<button
onClick={(e)=>{
e.stopPropagation()
likeItem(item.id)
}}
className="flex items-center gap-1"
>

<Heart
className={`w-4 h-4 ${
item.likedByMe
? "text-red-500 fill-red-500"
: "text-gray-400"
}`}
/>

{item.likesCount}

</button>

</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</div>

<Dialog open={openAdd} onOpenChange={setOpenAdd}>

<DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">

<DialogHeader>
<DialogTitle>{t("addItem")}</DialogTitle>
</DialogHeader>

<div className="flex flex-col gap-4">

{inventory?.customString1Enabled && (
<input
placeholder={inventory.customString1Name}
value={text1}
onChange={(e)=>setText1(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customString2Enabled && (
<input
placeholder={inventory.customString2Name}
value={text2}
onChange={(e)=>setText2(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customString3Enabled && (
<input
placeholder={inventory.customString3Name}
value={text3}
onChange={(e)=>setText3(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customNumber1Enabled && (
<input
type="number"
placeholder={inventory.customNumber1Name}
value={number1}
onChange={(e)=>setNumber1(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customNumber2Enabled && (
<input
type="number"
placeholder={inventory.customNumber2Name}
value={number2}
onChange={(e)=>setNumber2(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customNumber3Enabled && (
<input
type="number"
placeholder={inventory.customNumber3Name}
value={number3}
onChange={(e)=>setNumber3(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>
)}

{inventory?.customBool1Enabled && (
<label className="flex gap-2">
<input
type="checkbox"
checked={bool1}
onChange={(e)=>setBool1(e.target.checked)}
/>
{inventory.customBool1Name}
</label>
)}

{inventory?.customBool2Enabled && (
<label className="flex gap-2">
<input
type="checkbox"
checked={bool2}
onChange={(e)=>setBool2(e.target.checked)}
/>
{inventory.customBool2Name}
</label>
)}

{inventory?.customBool3Enabled && (
<label className="flex gap-2">
<input
type="checkbox"
checked={bool3}
onChange={(e)=>setBool3(e.target.checked)}
/>
{inventory.customBool3Name}
</label>
)}

<input
placeholder={t("documentUrl")}
value={doc1}
onChange={(e)=>setDoc1(e.target.value)}
className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
/>

{doc1 && (
<div className="border border-gray-300 dark:border-gray-700 p-2 rounded bg-white dark:bg-gray-800">

{doc1.toLowerCase().endsWith(".pdf") ? (

<iframe
src={doc1}
className="w-full h-40"
/>

) : (

<img
src={doc1}
className="max-h-40 object-contain"
/>

)}

</div>
)}

</div>

<DialogFooter>

<Button onClick={addItem}>
{t("create")}
</Button>

</DialogFooter>

</DialogContent>

</Dialog>

</div>

)

}