import { useEffect, useState } from "react"
import { api } from "@/api/apiClient"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

type Item = {
  id: string
  customId: string
  likesCount?: number

  number1?: number | null
  bool1?: boolean | null

  doc1?: string | null
}

type Props = {
  inventoryId: string
}

export default function StatsTab({ inventoryId }: Props) {

  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    loadItems()
  }, [inventoryId])


  async function loadItems() {

    const res = await api.get(`/items/by-inventory/${inventoryId}`)
    setItems(res.data)

  }


  /* ---------------- STATS ---------------- */

  const totalItems = items.length


  const totalLikes = items.reduce(
    (sum, item) => sum + (item.likesCount ?? 0),
    0
  )


  const itemsWithDocuments = items.filter(
    i => i.doc1 && i.doc1.trim() !== ""
  ).length


  const boolTrue = items.filter(i => i.bool1 === true).length
  const boolFalse = items.filter(i => i.bool1 === false).length


  const chartData = [
    { name: "True", value: boolTrue },
    { name: "False", value: boolFalse }
  ]


  /* ---------------- UI ---------------- */

  return (

    <div className="flex flex-col gap-8">

      {/* STATS CARDS */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Items</div>
          <div className="text-2xl font-semibold">{totalItems}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Likes</div>
          <div className="text-2xl font-semibold">{totalLikes}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Items With Documents</div>
          <div className="text-2xl font-semibold">{itemsWithDocuments}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Boolean True</div>
          <div className="text-2xl font-semibold">{boolTrue}</div>
        </div>

      </div>


      {/* BOOLEAN CHART */}

      <div className="bg-white border rounded-xl p-6">

        <div className="font-semibold mb-4">
          Boolean Distribution
        </div>

        <div className="h-[300px] w-[1000px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  )

}