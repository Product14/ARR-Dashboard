import type React from "react"
import { AdminTopBar } from "./admin-top-bar"
import { AdminSidebar } from "./admin-sidebar"

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB]">
      <AdminTopBar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
