import { api } from "./apiClient"

export function getAccessList(inventoryId:string){
 return api.get(`/inventoryaccess?inventoryId=${inventoryId}`)
}

export function addAccess(inventoryId:string,userId:string){
 return api.post(`/inventoryaccess/${userId}?inventoryId=${inventoryId}`)
}

export function removeAccess(inventoryId:string,userId:string){
 return api.delete(`/inventoryaccess/${userId}?inventoryId=${inventoryId}`)
}

export function searchUsers(query:string){
 return api.get(`/users/search?query=${query}`)
}

    