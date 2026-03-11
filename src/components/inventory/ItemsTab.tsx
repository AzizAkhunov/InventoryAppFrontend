import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"

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
  updateItem,
  deleteItems
} from "@/api/ItemsApi"

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
  text1: string
  number1?: number | null
  bool1?: boolean | null
}

type Props = {
  inventoryId: string
}

export default function ItemsTab({ inventoryId }: Props) {

  const [items, setItems] = useState<Item[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [search, setSearch] = useState("")

  const [openAdd, setOpenAdd] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [editItem, setEditItem] = useState<Item | null>(null)

  const [text1, setText1] = useState("")
  const [number1, setNumber1] = useState("")

  const filteredItems = items.filter(item =>
    (item.text1 ?? "").toLowerCase().includes(search.toLowerCase())
  )

  function toggleSelect(id: string) {

    if (selected.includes(id)) {
      setSelected(selected.filter(i => i !== id))
    } else {
      setSelected([...selected, id])
    }

  }

  function toggleSelectAll() {

    if (selected.length === filteredItems.length) {
      setSelected([])
    } else {
      setSelected(filteredItems.map(i => i.id))
    }

  }

  async function deleteSelected() {

    await deleteItems(selected)

    setItems(items.filter(item => !selected.includes(item.id)))

    setSelected([])

  }

  async function addItem() {

    const data = {
      inventoryId,
      text1,
      number1: Number(number1)
    }

    const res = await createItem(inventoryId, data)

    setItems([...items, res.data])

    setText1("")
    setNumber1("")

    setOpenAdd(false)

  }

  function openEditDialog(item: Item) {

    setEditItem(item)

    setText1(item.text1)
    setNumber1(String(item.number1 ?? ""))

    setOpenEdit(true)

  }

  async function saveEdit() {

    if (!editItem) return

    const data = {
      text1,
      number1: Number(number1)
    }

    await updateItem(editItem.id, data)

    const updated = items.map(item =>
      item.id === editItem.id
        ? { ...item, ...data }
        : item
    )

    setItems(updated)

    setOpenEdit(false)

  }

  useEffect(() => {

    async function loadItems() {

      const res = await getItems(inventoryId)

      setItems(res.data)

    }

    loadItems()

  }, [inventoryId])

  return (

    <div className="flex flex-col gap-8 items-center">

      <div className="flex justify-between w-[1200px]">

        <h2 className="text-3xl font-semibold">
          Items
        </h2>

        <div className="flex gap-4">

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setOpenAdd(true)}
          >
            <Plus className="w-4 h-4 mr-2"/>
            Add Item
          </Button>

          {selected.length > 0 && (
            <Button
              variant="destructive"
              onClick={deleteSelected}
            >
              <Trash className="w-4 h-4 mr-2"/>
              Delete
            </Button>
          )}

        </div>

      </div>

      <div className="w-[1200px]">

        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg px-4 py-3"
        />

      </div>

      <div className="w-[1200px] h-[400px] border rounded-xl overflow-y-auto">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead></TableHead>
              <TableHead>Custom ID</TableHead>
              <TableHead>Text</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {filteredItems.map(item => (

              <TableRow key={item.id}>

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

                <TableCell>
                  {item.text1 ?? "-"}
                </TableCell>

                <TableCell>
                  {item.number1 ?? "-"}
                </TableCell>

                <TableCell>
                  {item.bool1 ? "True" : "False"}
                </TableCell>

                <TableCell className="text-right">

                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-6"
                    onClick={() => openEditDialog(item)}
                  >
                    Edit
                  </Button>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </div>

    </div>

  )

}