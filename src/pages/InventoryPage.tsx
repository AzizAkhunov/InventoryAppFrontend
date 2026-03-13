import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

import CustomIdTab from "../components/inventory/CustomIdTab"
import ItemsTab from "../components/inventory/ItemsTab"
import DiscussionTab from "../components/inventory/DiscussionTab"
import StatsTab from "../components/inventory/StatsTab"
import SettingsTab from "../components/inventory/SettingsTab"

export default function InventoryPage() {

  const { id } = useParams()

  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("items")

  const discussionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if (tabFromUrl === "discussion") {
      setActiveTab("discussion")

      setTimeout(() => {
        discussionRef.current?.scrollIntoView({
          behavior: "smooth"
        })
      }, 200)
    }

  }, [tabFromUrl])


  return (

    <div className="flex flex-col gap-6">

      <h1 className="text-3xl font-semibold">
        Inventory {id}
      </h1>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-6"
      >

        <TabsList className="bg-gray-100 p-1 rounded-xl flex gap-2">

          <TabsTrigger
            value="items"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Items
          </TabsTrigger>

          <TabsTrigger
            value="discussion"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Discussion
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Settings
          </TabsTrigger>

          <TabsTrigger
            value="customId"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Custom ID
          </TabsTrigger>

          <TabsTrigger
            value="stats"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            Stats
          </TabsTrigger>

        </TabsList>


        <TabsContent value="items">
          <ItemsTab inventoryId={id!} />
        </TabsContent>

        <TabsContent value="discussion">
          <div ref={discussionRef}>
            <DiscussionTab inventoryId={id!} />
          </div>
        </TabsContent>

        <TabsContent value="stats">
          <StatsTab inventoryId={id!} />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTab inventoryId={id!} />
        </TabsContent>

        <TabsContent value="customId">
          <CustomIdTab inventoryId={id!} />
        </TabsContent>

      </Tabs>

    </div>

  )

}