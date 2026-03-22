import { api } from "./apiClient"

export interface SalesforceDto {
  firstName: string
  lastName: string
  company: string
  phone: string
  website: string
  email: string
}

export const createSalesforceAccount = async (data: SalesforceDto) => {
  const response = await api.post("/users/salesforce", data)
  return response.data
}