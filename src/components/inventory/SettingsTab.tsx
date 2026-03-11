import { useEffect, useState } from "react"
import { api } from "@/api/apiClient"
import { Button } from "@/components/ui/button"

type Inventory = {
  id: string
  title: string
  description?: string
  imageUrl?: string
  isPublic: boolean
  categoryName: string
}

type Props = {
  inventoryId: string
}

export default function SettingsTab({ inventoryId }: Props) {

  const [inventory, setInventory] = useState<Inventory | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [category, setCategory] = useState("")

  useEffect(() => {

    loadInventory()

  }, [inventoryId])


  async function loadInventory() {

    const res = await api.get(`/inventories/${inventoryId}`)

    const data = res.data

    setInventory(data)

    setTitle(data.title)
    setDescription(data.description ?? "")
    setImageUrl(data.imageUrl ?? "")
    setIsPublic(data.isPublic)
    setCategory(data.categoryName)

  }


  async function saveChanges() {

    await api.put(`/inventories/${inventoryId}`, {
      title,
      description,
      imageUrl,
      isPublic,
      categoryName: category
    })

    alert("Inventory updated")

  }


  async function deleteInventory() {

    if (!confirm("Delete this inventory?")) return

    await api.delete(`/inventories/${inventoryId}`)

    window.location.href = "/inventories"

  }


  if (!inventory) return null


return (

  <div className="flex flex-col gap-5 w-[1000px]">

    <h2 className="text-xl font-semibold">
      Inventory Settings
    </h2>

    {/* TITLE */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Title</label>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* DESCRIPTION */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Description</label>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
        rows={2}
      />
    </div>


    {/* CATEGORY */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Category</label>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* IMAGE */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">Image URL</label>

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* PUBLIC */}

    <div className="flex items-center gap-2 mt-1">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
      />

      <span className="text-sm">
        Public inventory
      </span>
    </div>


    {/* BUTTONS */}

    <div className="flex gap-3 mt-2">

      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={saveChanges}
      >
        Save Changes
      </Button>

      <Button
        variant="destructive"
        onClick={deleteInventory}
      >
        Delete Inventory
      </Button>

    </div>

  </div>

)

}