import { useEffect, useState } from "react"
import { getStats } from "@/api/AdminApi"

import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts"

export default function StatsTab(){

 const [stats,setStats] = useState<any>(null)

 useEffect(()=>{
  getStats().then(res => setStats(res.data))
 },[])

 if(!stats) return null

 const data = [
  { name:"Users", value:stats.users },
  { name:"Inventories", value:stats.inventories },
  { name:"Items", value:stats.items },
  { name:"Blocked", value:stats.blockedUsers }
 ]

 return(

 <div className="flex flex-col gap-4">

  {/* CARDS */}

  <div className="grid grid-cols-4 gap-4">

   <div className="bg-white border rounded-xl p-4 shadow-sm">
    <div className="text-sm text-gray-500">Users</div>
    <div className="text-3xl font-bold">{stats.users}</div>
   </div>

   <div className="bg-white border rounded-xl p-4 shadow-sm">
    <div className="text-sm text-gray-500">Inventories</div>
    <div className="text-3xl font-bold">{stats.inventories}</div>
   </div>

   <div className="bg-white border rounded-xl p-4 shadow-sm">
    <div className="text-sm text-gray-500">Items</div>
    <div className="text-3xl font-bold">{stats.items}</div>
   </div>

   <div className="bg-white border rounded-xl p-4 shadow-sm">
    <div className="text-sm text-gray-500">Blocked Users</div>
    <div className="text-3xl font-bold">{stats.blockedUsers}</div>
   </div>

  </div>

  {/* CHART */}

  <div className="bg-white border rounded-xl p-4 shadow-sm">

   <h2 className="text-lg font-semibold mb-2">
    Platform Overview
   </h2>

   <div className="h-60">

    <ResponsiveContainer width="100%" height="100%">

     <BarChart data={data}>

      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />

      <Bar
       dataKey="value"
       fill="#3b82f6"
       radius={[4,4,0,0]}
      />

     </BarChart>

    </ResponsiveContainer>

   </div>

  </div>

 </div>

 )
}