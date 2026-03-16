import { api } from "./apiClient";

export function getUsers(){
 return api.get("/admin/users")
}

export function makeAdmin(id:string){
 return api.post(`/admin/make-admin/${id}`)
}

export function blockUser(id:string){
 return api.post(`/admin/block/${id}`)
}

export function unblockUser(id:string){
 return api.post(`/admin/unblock/${id}`)
}

export function getStats(){
 return api.get("/admin/stats")
}

export function getInventories(){
 return api.get("/admin/inventories")
}

export function deleteInventory(id:string){
 return api.delete(`/admin/inventories/${id}`)
}

export function deleteUser(id:string){
 return api.delete(`/admin/users/${id}`)
}