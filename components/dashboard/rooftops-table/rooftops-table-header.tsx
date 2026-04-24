interface RooftopsTableHeaderProps {
  snapshotDate?: string
  period?: string
}

export function RooftopsTableHeader({ snapshotDate = "As of Mar 19, 2026", period = "Mar 1 – Mar 19" }: RooftopsTableHeaderProps) {
  return (
    <thead>
      <tr className="border-b border-gray-200">
        <th className="min-w-[400px] px-4 py-2 border-r border-gray-200" />

        <th className="px-4 py-2 border-r border-gray-200" />

        <th className="px-4 py-2 border-r border-gray-200" />

        <th colSpan={2} className="px-4 py-2 text-center border-r border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-semibold tracking-widest text-[#2563eb] uppercase">Snapshot</span>
            <span className="text-xs text-[#2563eb] font-normal">{snapshotDate}</span>
          </div>
        </th>

        <th colSpan={2} className="px-4 py-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-semibold tracking-widest text-[#b45309] uppercase">Retention</span>
            <span className="text-xs text-[#b45309] font-normal">{period}</span>
          </div>
        </th>
      </tr>

      <tr className="bg-gray-50 border-b border-gray-200 h-9">
        <th className="px-4 py-2 text-left border-r border-gray-200">
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
