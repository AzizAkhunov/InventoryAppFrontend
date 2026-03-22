import { api } from "./apiClient"

export const getInventories = () => {
  return api.get("/inventories")
}

export const createInventory = (data: any) => {
  return api.post("/inventories", data)
}

export const getInventoryById = (id: string) => {
  return api.get(`/inventories/${id}`)
}

export const getMyInventories = () =>
  api.get("/inventories/my")

export const getSharedInventories = () =>
  api.get("/inventories/shared")

export function saveCustomId(inventoryId: string, elements: any[]) {
  return api.post(`/inventories/${inventoryId}/custom-id`, elements)
}

export function getInventoriesByTag(tag: string) {
  return api.get(`/inventories/by-tag?tag=${tag}`)
}

export function generateInventoryApiToken(inventoryId: string) {
  return api.post(`/external/inventories/${inventoryId}/token`)
}

export function getInventoryImportByToken(token: string) {
  return api.get(`/external/inventories/import?token=${encodeURIComponent(token)}`)
}