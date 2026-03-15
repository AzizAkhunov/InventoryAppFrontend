import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"
import { getInventoryById } from "@/api/InventoryApi"
import CustomIdTab from "../components/inventory/CustomIdTab"
import ItemsTab from "../components/inventory/ItemsTab"
import DiscussionTab from "../components/inventory/DiscussionTab"
import StatsTab from "../components/inventory/StatsTab"
import SettingsTab from "../components/inventory/SettingsTab"
import AccessTab from "@/components/inventory/AccessTab"

export default function InventoryPage() {

  const { t } = useTranslation()

  const { id} = useParams()
  const [title, setTitle] = useState("")
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get("tab")

  const [activeTab, setActiveTab] = useState("items")

  const discussionRef = useRef<HTMLDivElement>(null)

useEffect(() => {
async function loadInventory(){

const res = await getInventoryById(id!)
setTitle(res.data.title)

}

loadInventory()

}, [id])


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
  {t("inventory")}: 
  <span className="text-blue-600 ml-2">
    {title}
  </span>
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
            {t("items")}
          </TabsTrigger>

          <TabsTrigger
            value="discussion"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            {t("discussion")}
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            {t("settings")}
          </TabsTrigger>

          <TabsTrigger
            value="customId"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            {t("customId")}
          </TabsTrigger>

          <TabsTrigger
            value="stats"
            className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
          >
            {t("stats")}
          </TabsTrigger>

          <TabsTrigger
 value="access"
 className="px-6 py-2 rounded-lg text-sm font-medium transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
>
Access
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

        <TabsContent value="access">
 <AccessTab inventoryId={id!}/>
</TabsContent>

      </Tabs>

    </div>

  )

}