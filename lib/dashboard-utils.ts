import type { AnalyticsData, EnterpriseData } from "@/types/dashboard"

export const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$ ${(value / 1000000).toFixed(2)}M`
  } else if (value >= 1000) {
    return `$ ${(value / 1000).toFixed(1)}K`
  }
  return `$ ${value.toFixed(2)}`
}

export const recalculateAnalytics = (tableData: EnterpriseData[]): AnalyticsData => {
  const contractedLive = tableData.filter((item) => item.status === "Live").reduce((sum, item) => sum + item.arr, 0)

  const activeProjects = tableData
    .filter((item) => item.status === "Live" || item.status === "Onboarding")
    .reduce((sum, item) => sum + item.arr, 0)

  const pendingApproval = tableData
    .filter((item) => item.status === "Onboarding")
    .reduce((sum, item) => sum + item.arr, 0)

  const completedTasks = tableData
    .filter((item) => item.status === "Contracted")
    .reduce((sum, item) => sum + item.arr, 0)

  return {
    contractedLive,
    activeProjects,
    pendingApproval,
    completedTasks,
  }
}
