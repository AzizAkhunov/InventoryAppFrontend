import { api } from "./apiClient"

export const getItems = (inventoryId: string) =>
  api.get(`/items/by-inventory/${inventoryId}`)

export const createItem = (inventoryId: string, data: any) =>
  api.post(`/items`, {
    inventoryId,
    ...data
  })

export const updateItem = (id: string, data: any) =>
  api.put(`/items/${id}`, data)

export const deleteItems = async (ids: string[]) => {
  await Promise.all(
    ids.map(id => api.delete(`/items/${id}`))
  )
}