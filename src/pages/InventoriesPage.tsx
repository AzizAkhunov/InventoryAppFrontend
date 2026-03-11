import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { Plus, Search, Boxes } from "lucide-react"
import { useState, useEffect } from "react"
import { getInventories, createInventory, getMyInventories, getSharedInventories } from "@/api/InventoryApi"
import { useAuth } from "@/context/AuthContext"


export default function InventoriesPage() {

  const navigate = useNavigate()
  const { user } = useAuth()

  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const [mode, setMode] = useState<"all" | "my" | "shared">("all")

  const [inventories, setInventories] = useState<any[]>([])

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [isPublic, setIsPublic] = useState(false)

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
      tags: tags ? tags.split(",").map(t => t.trim()) : []
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

      setOpen(false)

    } catch (err) {

      console.error(err)
      alert("Failed to create inventory")

    }

  }

  return (

    <div className="flex flex-col gap-6">

      {/* HEADER */}

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

      {/* FILTER + SEARCH */}

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

      {/* INVENTORY GRID */}

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

      {/* CREATE INVENTORY MODAL */}

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto flex flex-col gap-4">

            <h2 className="text-xl font-semibold">
              Create Inventory
            </h2>

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

              <span>Is Public</span>

            </div>

            <div className="flex gap-3 mt-2">

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