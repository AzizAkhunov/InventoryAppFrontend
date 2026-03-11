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