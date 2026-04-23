"use client"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { useState } from "react"

export default function EnterpriseDashboard() {
  const [activeTab, setActiveTab] = useState<"all" | "studio_ai" | "vini_ai">("all")

  const tabs = [
    { id: "all" as const, label: "All", count: 1890 },
    { id: "studio_ai" as const, label: "Studio AI", count: 278 },
    { id: "vini_ai" as const, label: "Vini AI", count: 209 },
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="px-8 py-6">
        <div className="max-w-12xl mx-0">
          <h1 className="text-gray-900 font-medium text-xl mb-4">ARR Dashboard</h1>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {activeTab === tab.id ? <strong>{tab.label}</strong> : tab.label}{" "}
                <span className="text-gray-400 font-normal">({tab.count.toLocaleString()})</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mb-6">
            <DashboardTabs activeTab={activeTab} />
          </div>
        </div>
      </main>
    </div>
  )
}
