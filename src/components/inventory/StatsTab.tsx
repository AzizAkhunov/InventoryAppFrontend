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

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Items</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalItems}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Likes</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{totalLikes}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Items With Documents</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{itemsWithDocuments}</div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Boolean True</div>
          <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{boolTrue}</div>
        </div>

      </div>


      {/* BOOLEAN CHART */}

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6">

        <div className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Boolean Distribution
        </div>

        <div className="h-[300px] w-[1000px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
  <XAxis dataKey="name" stroke="#9ca3af" />
  <YAxis stroke="#9ca3af" />
  <Tooltip />
  <Bar dataKey="value" fill="#3b82f6" radius={[6,6,0,0]} />
</BarChart>
          </ResponsiveContainer>

        </div>

      </div>

    </div>

  )

}