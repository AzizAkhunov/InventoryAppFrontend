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
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 border p-3 rounded-lg bg-white"
    >

      <select
        value={element.type}
        onChange={e=>updateType(index,e.target.value)}
        className="border p-2 rounded"
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
          className="border p-2 rounded"
          placeholder="Text"
        />

      )}

      {element.type==="Sequence" && (

<input
type="number"
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


  function addElement(type:string){

    setElements([
      ...elements,
      {
        id: crypto.randomUUID(),
        type
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
        result+=el.value ?? "0001"
      }

      if(el.type==="Random20Bit"){
        result+=Math.random().toString(16).slice(2,7).toUpperCase()
      }

      if(el.type==="DateTime"){
        result+=new Date().getFullYear()
      }

    })

    return result

  }


async function saveBuilder() {

  const payload = elements.map(el => {

    if (el.type === "FixedText") {
      return {
        type: 0,
        fixedText: el.value,
        padding: null
      }
    }

    if (el.type === "Sequence") {
      return {
        type: 1,
        padding: Number(el.value ?? 3)
      }
    }

    if (el.type === "Random20Bit") {
      return {
        type: 2
      }
    }

    if (el.type === "DateTime") {
      return {
        type: 3
      }
    }

  })

  await saveCustomId(inventoryId, payload)

  alert("Custom ID saved")

}



  return(

    <div className="flex flex-col gap-6">

      <h3 className="text-xl font-semibold">
        Custom ID Builder
      </h3>


      {/* PREVIEW */}

      <div className="bg-gray-100 p-4 rounded-lg">

        <div className="text-sm text-gray-500 mb-1">
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
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Add Fixed
        </button>

        <button
          onClick={()=>addElement("Sequence")}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Add Sequence
        </button>

        <button
          onClick={()=>addElement("Random20Bit")}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Add Random
        </button>

        <button
          onClick={()=>addElement("DateTime")}
          className="border px-4 py-2 rounded hover:bg-gray-100"
        >
          Add Date
        </button>

      </div>


      <button
        onClick={saveBuilder}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Save Custom ID
      </button>

    </div>

  )

}