import { Menu, BarChart3 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Menu className="h-6 w-6 text-gray-600" />
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-[#645cff]" />
            <span className="text-xl font-semibold text-[#645cff]">Console</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Mega Dealer</div>
            <div className="text-sm font-medium text-gray-900">Ford Sec 48</div>
          </div>
          <Avatar className="h-10 w-10">
            <AvatarImage src="/professional-business-person.png" />
            <AvatarFallback className="bg-[#645cff] text-white">FS</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
