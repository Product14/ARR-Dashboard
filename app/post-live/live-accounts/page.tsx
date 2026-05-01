"use client"
import { LiveAccountsTable } from "@/components/post-live/live-accounts/live-accounts-table"
import { useState } from "react"

export default function LiveAccountsPage() {
  const [activeTab, setActiveTab] = useState<"studio_ai" | "vini_ai">("studio_ai")
  const [viewMode, setViewMode] = useState<"rooftops" | "enterprise">("rooftops")

  const tabs = [
    { id: "studio_ai" as const, label: "Studio AI", count: 278 },
    { id: "vini_ai" as const, label: "Vini AI", count: 209 },
  ]

  return (
    <div className="px-8 py-6">
      <h1 className="text-gray-900 font-semibold text-xl mb-5">Live Accounts - Rooftop Overview</h1>

      <div className="flex items-end border-b border-gray-200 mb-6">
        <div className="flex">
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

        <div className="ml-auto mb-1 flex items-center bg-gray-100 rounded-lg p-0.5 gap-0.5">
          <button
            onClick={() => setViewMode("rooftops")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "rooftops"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Rooftops
          </button>
          <button
            onClick={() => setViewMode("enterprise")}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === "enterprise"
                ? "bg-white text-blue-600 shadow-sm font-semibold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Enterprise
          </button>
        </div>
      </div>

      <div className="mb-6">
        <LiveAccountsTable activeTab={activeTab} />
      </div>
    </div>
  )
}
