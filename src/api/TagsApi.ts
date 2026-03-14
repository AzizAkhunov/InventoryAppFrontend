import { api } from "./apiClient"

export function getTagCloud() {
  return api.get("/tags/cloud")
}