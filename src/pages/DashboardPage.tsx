import { useEffect, useState } from "react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip
} from "recharts"

import { Package, Boxes, Users, MessageSquare } from "lucide-react"

import { api } from "@/api/apiClient"

type Stats = {
  inventories: number
  items: number
  posts: number
  users: number
}

type Activity = {
  month: string
  value: number
}

export default function DashboardPage() {

  const [stats, setStats] = useState<Stats>({
    inventories: 0,
    items: 0,
    posts: 0,
    users: 0
  })

  const [activity, setActivity] = useState<Activity[]>([])

  useEffect(() => {

    loadStats()
    loadActivity()

  }, [])


  async function loadStats() {

    const res = await api.get("/dashboard/stats")

    setStats(res.data)

  }


  async function loadActivity() {

    const res = await api.get("/dashboard/activity")

    setActivity(res.data)

  }


  const statsList = [
    {
      title: "Inventories",
      value: stats.inventories,
      icon: Boxes
    },
    {
      title: "Items",
      value: stats.items,
      icon: Package
    },
    {
      title: "Discussion Posts",
      value: stats.posts,
      icon: MessageSquare
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users
    }
  ]


  return (

    <div className="p-8 flex flex-col gap-8">

      <h1 className="text-3xl font-semibold">
        Dashboard
      </h1>


      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {statsList.map((s, i) => {

          const Icon = s.icon

          return (

            <Card
              key={i}
              className="shadow-sm hover:shadow-lg transition"
            >

              <CardHeader className="flex flex-row items-center justify-between pb-2">

                <CardTitle className="text-sm text-muted-foreground">
                  {s.title}
                </CardTitle>

                <Icon className="h-4 w-4 text-muted-foreground"/>

              </CardHeader>

              <CardContent>

                <p className="text-3xl font-bold">
                  {s.value}
                </p>

              </CardContent>

            </Card>

          )

        })}

      </div>


      {/* CHART */}

      <Card className="shadow-sm">

        <CardHeader>

          <CardTitle>
            Activity
          </CardTitle>

        </CardHeader>

        <CardContent className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={activity}>

              <XAxis dataKey="month"/>

              <Tooltip/>

              <Bar
                dataKey="value"
                fill="#3b82f6"
                radius={[6,6,0,0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </CardContent>

      </Card>

    </div>

  )
}