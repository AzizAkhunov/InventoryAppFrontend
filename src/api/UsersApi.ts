import { api } from "./apiClient"

export const getUsers = () =>
  api.get("/admin/users")