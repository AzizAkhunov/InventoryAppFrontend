import { useState } from "react"

import {
  DndContext,
  closestCenter
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove
} from "@dnd-kit/sortable"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { saveCustomId } from "@/api/InventoryApi"


type Element = {
  id: string
  type: string
  value?: string
}

type Props = {
  inventoryId: string
}


function SortableItem({
  element,
  index,
  updateType,
  updateValue,
  removeElement
}:{
  element: Element
  index: number
  updateType:(i:number,t:string)=>void
  updateValue:(i:number,v:string)=>void
  removeElement:(i:number)=>void
}){

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: element.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return(

    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-white dark:bg-gray-900"
    >
<div
    {...attributes}
    {...listeners}
    className="cursor-grab text-gray-400 select-none"
  >⠿</div>
      <select
        value={element.type}
        onChange={e=>updateType(index,e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
      >

        <option value="FixedText">Fixed</option>
        <option value="Sequence">Sequence</option>
        <option value="Random20Bit">Random</option>
        <option value="DateTime">Date</option>

      </select>

      {element.type==="FixedText" && (

        <input
          value={element.value ?? ""}
          onChange={e=>updateValue(index,e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 rounded"
          placeholder="Text"
        />

      )}

      {element.type==="Sequence" && (

<input
type="text"
value={element.value ?? ""}
onChange={e=>updateValue(index,e.target.value)}
className="border p-2 rounded"
placeholder="0001"
/>

)}

      <button
  onPointerDown={(e) => e.stopPropagation()}
  onClick={() => removeElement(index)}
  className="text-red-500 hover:text-red-700"
>
Delete
</button>

    </div>

  )

}



export default function CustomIdTab({inventoryId}:Props){

  const [elements,setElements] = useState<Element[]>([
    { id:"1", type:"FixedText", value:"INV-" },
    { id:"2", type:"Sequence", value:"0001" }
  ])
const [success, setSuccess] = useState(false)

function addElement(type:string){

  let value: string | undefined

  if(type==="FixedText") value="INV-"
  if(type==="Sequence") value="0001"
  if(type==="DateTime") value="yyyy"

  setElements(prev => [
    ...prev,
    {
      id: crypto.randomUUID(),
      type,
      value
    }
  ])

}


  function updateValue(index:number,value:string){

    const updated=[...elements]
    updated[index].value=value
    setElements(updated)

  }


function updateType(index:number,type:string){

  const updated=[...elements]

  updated[index].type=type

  if(type==="FixedText"){
    updated[index].value="INV-"
  }

  if(type==="Sequence"){
    updated[index].value="0001"
  }

  if(type==="Random20Bit"){
    updated[index].value=""
  }

  if(type==="DateTime"){
    updated[index].value="yyyy"
  }

  setElements(updated)

}


  function removeElement(index:number){

    const updated = elements.filter((_,i)=>i!==index)
    setElements(updated)

  }


  function handleDragEnd(event:any){

    const {active,over} = event

    if(!over) return

    if(active.id!==over.id){

      const oldIndex = elements.findIndex(e=>e.id===active.id)
      const newIndex = elements.findIndex(e=>e.id===over.id)

      setElements(arrayMove(elements,oldIndex,newIndex))

    }

  }


  function generatePreview(){

    let result=""

    elements.forEach(el=>{

      if(el.type==="FixedText"){
        result+=el.value ?? ""
      }

      if(el.type==="Sequence"){
        const padding = (el.value ?? "0001").length

        result += "1".padStart(padding,"0")
      }

      if(el.type==="Random20Bit"){
        const value = Math.floor(Math.random() * (1 << 20))

        result += value.toString(16).toUpperCase().padStart(5,"0")
      }

      if(el.type==="DateTime"){
        result+=new Date().toISOString().slice(0,4)
      }

    })

    return result

  }


async function saveBuilder(){

  const payload = elements.map((el, index) => {

    if (el.type === "FixedText") {
      return {
        order: index,
        type: 0,
        fixedText: el.value,
        padding: null
      }
    }

    if (el.type === "Sequence") {
      return {
        order: index,
        type: 7,
        padding: (el.value ?? "0001").length
      }
    }

    if (el.type === "Random20Bit") {
      return {
        order: index,
        type: 1
      }
    }

    if (el.type === "DateTime") {
      return {
        order: index,
        type: 6
      }
    }

  })

  await saveCustomId(inventoryId, payload)

  setSuccess(true)

  setTimeout(()=>{
    setSuccess(false)
  },2000)

}

  return(

    <div className="flex flex-col gap-6">

      <h3 className="text-xl font-semibold">
        Custom ID Builder
      </h3>
{success && (
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
    Inventory updated
  </div>
)}

      {/* PREVIEW */}

      <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
          Example
        </div>

        <div className="font-mono text-lg">
          {generatePreview()}
        </div>

      </div>



      {/* DRAG AREA */}

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >

        <SortableContext
          items={elements.map(e=>e.id)}
          strategy={verticalListSortingStrategy}
        >

          <div className="flex flex-col gap-3">

            {elements.map((el,i)=>(
              <SortableItem
                key={el.id}
                element={el}
                index={i}
                updateType={updateType}
                updateValue={updateValue}
                removeElement={removeElement}
              />
            ))}

          </div>

        </SortableContext>

      </DndContext>



      {/* ADD BUTTONS */}

      <div className="flex gap-3">

        <button
          onClick={()=>addElement("FixedText")}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          Add Fixed
        </button>

        <button
          onClick={()=>addElement("Sequence")}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          Add Sequence
        </button>

        <button
          onClick={()=>addElement("Random20Bit")}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          Add Random
        </button>

        <button
          onClick={()=>addElement("DateTime")}
          className="border border-gray-300 dark:border-gray-700 px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          Add Date
        </button>

      </div>


      <button
        onClick={saveBuilder}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow-sm"
      >
        Save Custom ID
      </button>

    </div>

  )

}