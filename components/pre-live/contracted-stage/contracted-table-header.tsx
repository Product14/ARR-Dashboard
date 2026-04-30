interface RooftopsTableHeaderProps {
  snapshotDate?: string
  period?: string
}

export function RooftopsTableHeader({ snapshotDate = "As of Mar 19, 2026", period = "Mar 1 – Mar 19" }: RooftopsTableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-50 border-b border-gray-200 h-9">
        <th className="px-4 py-2 text-left sticky left-0 z-20 bg-gray-50 shadow-[inset_-1px_0_0_0_#e5e7eb]">
          <span className="text-xs font-semibold text-gray-700">Enterprises</span>
        </th>

        <th className="px-4 py-2 text-left whitespace-nowrap border-r border-gray-200">
          <span className="text-xs font-semibold text-gray-700">Stage</span>
        </th>

        <th className="px-4 py-2 text-left whitespace-nowrap border-r border-gray-200">
          <span className="text-xs font-semibold text-gray-700">Sub Stage</span>
        </th>

        <th className="min-w-[140px] px-4 py-2 text-right whitespace-nowrap border-r border-gray-200">
          <div className="text-xs font-semibold text-gray-700">CARR ↓</div>
        </th>

        <th className="min-w-[140px] px-4 py-2 text-right whitespace-nowrap border-r border-gray-200">
          <div className="text-xs font-semibold text-gray-700">LARR</div>
        </th>

        <th className="min-w-[130px] px-4 py-2 text-right whitespace-nowrap border-r border-gray-200">
          <div className="text-xs font-semibold text-gray-700">GRR</div>
        </th>

        <th className="min-w-[130px] px-4 py-2 text-right whitespace-nowrap">
          <div className="text-xs font-semibold text-gray-700">NRR</div>
        </th>
      </tr>
    </thead>
  )
}
