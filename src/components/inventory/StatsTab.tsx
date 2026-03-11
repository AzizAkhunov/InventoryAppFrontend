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
  text1?: string
  number1?: number | null
  bool1?: boolean | null
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


  const totalItems = items.length

  const boolTrue = items.filter(i => i.bool1 === true).length
  const boolFalse = items.filter(i => i.bool1 === false).length

  const numbers = items
    .map(i => i.number1)
    .filter((n): n is number => n !== null && n !== undefined)

  const avg =
    numbers.length > 0
      ? (numbers.reduce((a, b) => a + b, 0) / numbers.length).toFixed(2)
      : 0

  const max = numbers.length ? Math.max(...numbers) : 0
  const min = numbers.length ? Math.min(...numbers) : 0


  const chartData = [
    { name: "True", value: boolTrue },
    { name: "False", value: boolFalse }
  ]


  return (

    <div className="flex flex-col gap-8">

      {/* STATS CARDS */}

      <div className="grid grid-cols-4 gap-6">

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Items</div>
          <div className="text-2xl font-semibold">{totalItems}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Average Number</div>
          <div className="text-2xl font-semibold">{avg}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Max Number</div>
          <div className="text-2xl font-semibold">{max}</div>
        </div>

        <div className="bg-white border rounded-xl p-4">
          <div className="text-sm text-gray-500">Min Number</div>
          <div className="text-2xl font-semibold">{min}</div>
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