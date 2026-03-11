import { api } from "./apiClient";

export const getDashboardStats = () => 
    api.get("/dashboard/stats")

export const getDashboardActivity = () =>
    api.get("/dashboard/activity")