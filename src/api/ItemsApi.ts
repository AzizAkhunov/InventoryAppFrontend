import { api } from "./apiClient"

export const getItems = (inventoryId: string) =>
  api.get(`/items/by-inventory/${inventoryId}`)

export const createItem = (data: any) =>
  api.post("/items", data)

export const updateItem = (id: string, data: any) =>
  api.put(`/items/${id}`, data)

export const deleteItem = (id:string) =>
api.delete(`/items/${id}`)

export function toggleLike(itemId: string) {
  return api.post(`/likes/${itemId}`)
}