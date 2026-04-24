import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function AdminTopBar() {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-5 flex-shrink-0">
      <span className="text-base font-semibold text-gray-900">Admin Tools</span>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-[#4F46E5] text-white text-sm font-medium">R</AvatarFallback>
      </Avatar>
    </header>
  )
}
