import type { StatusBadgeProps } from "@/types/dashboard"

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    Live: {
      bg: "#ecfdf3",
      color: "#027a48",
    },
    Onboarding: {
      bg: "#fffaeb",
      color: "#866800",
    },
    Contracted: {
      bg: "#fff6ed",
      color: "#c4320a",
    },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || {
    bg: "#f3f4f6",
    color: "#374151",
  }

  return (
    <div className="flex items-center justify-center px-3 py-0.5 rounded-2xl" style={{ backgroundColor: config.bg }}>
      <span className="font-medium text-xs leading-[18px]" style={{ color: config.color }}>
        {status}
      </span>
    </div>
  )
}
