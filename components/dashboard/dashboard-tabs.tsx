"use client"

import { RooftopsTable } from "./rooftops-table/rooftops-table"

interface DashboardTabsProps {
  activeTab: "all" | "studio_ai" | "vini_ai"
}

export function DashboardTabs({ activeTab }: DashboardTabsProps) {
  return (
    <div className="w-full">
      <RooftopsTable activeTab={activeTab} />
    </div>
  )
}
