import { useEffect, useState } from "react"
import { api } from "@/api/apiClient"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog"
import { useNavigate } from "react-router-dom"

type Inventory = {
  id: string
  title: string
  description?: string
  imageUrl?: string
  isPublic: boolean
  categoryName: string
  version: number
}

type Props = {
  inventoryId: string
}

export default function SettingsTab({ inventoryId }: Props) {
  const { t } = useTranslation()
  const [inventory, setInventory] = useState<Inventory | null>(null)
  const [version, setVersion] = useState(0)
const [success, setSuccess] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [category, setCategory] = useState("")
  const navigate = useNavigate()
  useEffect(() => {

    loadInventory()

  }, [inventoryId])


  async function loadInventory() {

    const res = await api.get(`/inventories/${inventoryId}`)

    const data = res.data

    setInventory(data)

    setTitle(data.title)
    setDescription(data.description ?? "")
    setImageUrl(data.imageUrl ?? "")
    setIsPublic(data.isPublic)
    setCategory(data.categoryName)

    setVersion(data.version)
  }


async function saveChanges() {

  try {

    const res = await api.put(`/inventories/${inventoryId}`, {
      title,
      description,
      imageUrl,
      isPublic,
      categoryName: category,
      version
    })

    setVersion(res.data.version)

    setSuccess(true)

    setTimeout(() => {
      setSuccess(false)
    }, 2000)

  } catch (err:any) {

    if (err.response?.status === 409) {
      alert("Inventory was modified by another user. Please refresh.")
    }

  }

}


  async function deleteInventory() {

    await api.delete(`/inventories/${inventoryId}`)

    navigate("/inventories")

  }


  if (!inventory) return null


return (

  
  <div className="flex flex-col gap-5 w-[1000px]">

    <h2 className="text-xl font-semibold">
      {t("inventorySettings")}
    </h2>
{success && (
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
    Inventory updated
  </div>
)}
    {/* TITLE */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{t("title")}</label>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* DESCRIPTION */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{t("description")}</label>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
        rows={2}
      />
    </div>


    {/* CATEGORY */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{t("category")}</label>

      <input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* IMAGE */}

    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{t("imageUrl")}</label>

      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 text-sm"
      />
    </div>


    {/* PUBLIC */}

    <div className="flex items-center gap-2 mt-1">
      <input
        type="checkbox"
        checked={isPublic}
        onChange={(e) => setIsPublic(e.target.checked)}
      />

      <span className="text-sm">
        Public inventory
      </span>
    </div>


    {/* BUTTONS */}

    <div className="flex gap-3 mt-2">

      <Button
        className="bg-blue-600 hover:bg-blue-700"
        onClick={saveChanges}
      >
        {t("saveChanges")}
      </Button>

      <AlertDialog>

  <AlertDialogTrigger asChild>

    <Button variant="destructive">
      {t("deleteInventory")}
    </Button>

  </AlertDialogTrigger>

<AlertDialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">

    <AlertDialogHeader>

      <AlertDialogTitle>
        {t("deleteInventory")}
      </AlertDialogTitle>

      <AlertDialogDescription>
        {t("DeleteDesc")}
      </AlertDialogDescription>

    </AlertDialogHeader>

    <AlertDialogFooter>

      <AlertDialogCancel>
        {t("cancel")}
      </AlertDialogCancel>

      <AlertDialogAction
        className="bg-red-600 hover:bg-red-700"
        onClick={deleteInventory}
      >
        {t("delete")}
      </AlertDialogAction>

    </AlertDialogFooter>

  </AlertDialogContent>

</AlertDialog>

    </div>

  </div>

)

}