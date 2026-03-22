import { useParams, useSearchParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useTranslation } from "react-i18next"
import { getInventoryById, generateInventoryApiToken } from "@/api/InventoryApi"
import CustomIdTab from "../components/inventory/CustomIdTab"
import ItemsTab from "../components/inventory/ItemsTab"
import DiscussionTab from "../components/inventory/DiscussionTab"
import StatsTab from "../components/inventory/StatsTab"
import SettingsTab from "../components/inventory/SettingsTab"
import AccessTab from "@/components/inventory/AccessTab"
import { toast } from "sonner"

export default function InventoryPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()

  const [title, setTitle] = useState("")
  const [apiToken, setApiToken] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("items")
  const [isGeneratingToken, setIsGeneratingToken] = useState(false)

  const tabFromUrl = searchParams.get("tab")
  const discussionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadInventory() {
      if (!id) return

      try {
        const res = await getInventoryById(id)
        setTitle(res.data.title)
      } catch (error) {
        console.error(error)
        toast.error("Failed to load inventory")
      }
    }

    loadInventory()
  }, [id])

  const handleGenerateToken = async () => {
    if (!id) return

    try {
      setIsGeneratingToken(true)
      const res = await generateInventoryApiToken(id)
      setApiToken(res.data.token)
      toast.success("API token generated")
    } catch (error: any) {
      console.error(error)
      toast.error(error?.response?.data?.message || "Failed to generate API token")
    } finally {
      setIsGeneratingToken(false)
    }
  }

  const handleCopyToken = async () => {
    if (!apiToken) return

    try {
      await navigator.clipboard.writeText(apiToken)
      toast.success("API token copied")
    } catch (error) {
      console.error(error)
      toast.error("Failed to copy token")
    }
  }

  useEffect(() => {
    if (tabFromUrl === "discussion") {
      setActiveTab("discussion")

      setTimeout(() => {
        discussionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }, 200)
    }
  }, [tabFromUrl])

  return (
    <div className="flex flex-col gap-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
        {t("inventory")}:
        <span className="ml-2 text-blue-600 dark:text-blue-400">
          {title}
        </span>
      </h1>

      <div className="flex flex-col gap-3 rounded-xl border bg-white p-4 shadow-sm dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            API Token (Odoo integration)
          </span>

          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            Read-only
          </span>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          Generate a token and use it in Odoo to import inventory statistics.
        </p>

        {!apiToken ? (
          <button
            onClick={handleGenerateToken}
            disabled={isGeneratingToken}
            className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGeneratingToken ? "Generating..." : "Generate API Token"}
          </button>
        ) : (
          <div className="flex flex-col gap-3 rounded-lg bg-gray-100 px-3 py-3 dark:bg-gray-800">
            <div className="break-all font-mono text-xs text-gray-800 dark:text-gray-100">
              {apiToken}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyToken}
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white transition hover:bg-blue-700"
              >
                Copy
              </button>

              <button
                onClick={handleGenerateToken}
                disabled={isGeneratingToken}
                className="rounded-lg border px-3 py-1.5 text-sm transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-gray-700"
              >
                {isGeneratingToken ? "Generating..." : "Regenerate"}
              </button>
            </div>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-6"
      >
        <TabsList className="flex gap-2 rounded-xl border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
          <TabsTrigger
            value="items"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("items")}
          </TabsTrigger>

          <TabsTrigger
            value="discussion"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("discussion")}
          </TabsTrigger>

          <TabsTrigger
            value="settings"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("settings")}
          </TabsTrigger>

          <TabsTrigger
            value="customId"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("customId")}
          </TabsTrigger>

          <TabsTrigger
            value="stats"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t("stats")}
          </TabsTrigger>

          <TabsTrigger
            value="access"
            className="rounded-lg px-6 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-200 data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Access
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items">
          {id && <ItemsTab inventoryId={id} />}
        </TabsContent>

        <TabsContent value="discussion">
          <div ref={discussionRef}>
            {id && <DiscussionTab inventoryId={id} />}
          </div>
        </TabsContent>

        <TabsContent value="stats">
          {id && <StatsTab inventoryId={id} />}
        </TabsContent>

        <TabsContent value="settings">
          {id && <SettingsTab inventoryId={id} />}
        </TabsContent>

        <TabsContent value="customId">
          {id && <CustomIdTab inventoryId={id} />}
        </TabsContent>

        <TabsContent value="access">
          {id && <AccessTab inventoryId={id} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}