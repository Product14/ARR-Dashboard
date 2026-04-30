"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home, BarChart3, Users, TrendingUp, BookOpen, Target, Layers, Building2, Cpu, MessageSquare, Server, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  icon?: React.ReactNode
  hasChevron?: boolean
  isActive?: boolean
  isSubItem?: boolean
  href?: string
  timelineStyle?: boolean
  children?: NavItem[]
}

interface SectionGroup {
  sectionLabel?: string
  items: NavItem[]
}

const navGroups: SectionGroup[] = [
  {
    items: [
      { label: "Home", icon: <Home className="h-4 w-4" /> },
      {
        label: "Executive View",
        icon: <BarChart3 className="h-4 w-4" />,
        children: [
          { label: "ARR Dashboard", href: "/", isSubItem: true },
        ],
      },
      {
        label: "Pre live",
        icon: <Users className="h-4 w-4" />,
        hasChevron: true,
        timelineStyle: true,
        children: [
          { label: "Contracted stage", href: "/pre-live/contracted-stage", isSubItem: true },
          { label: "Onboarding stage", href: "/pre-live/onboarding-stage", isSubItem: true },
        ],
      },
      {
        label: "Post live",
        icon: <TrendingUp className="h-4 w-4" />,
        hasChevron: true,
        timelineStyle: true,
        children: [
          { label: "Live accounts", href: "/post-live/live-accounts", isSubItem: true },
          { label: "Red accounts", href: "/post-live/red-accounts", isSubItem: true },
          { label: "Churned accounts", href: "/post-live/churned-accounts", isSubItem: true },
        ],
      },
    ],
  },
  {
    sectionLabel: "ANALYTICS & REVIEW",
    items: [
      {
        sectionLabel: "COMPANY",
        items: [
          { label: "Business reports", icon: <BookOpen className="h-4 w-4" />, hasChevron: true },
          { label: "OKR", icon: <Target className="h-4 w-4" /> },
          { label: "Programs", icon: <Layers className="h-4 w-4" /> },
          { label: "Departments", icon: <Building2 className="h-4 w-4" />, hasChevron: true },
        ],
      } as any,
    ],
  },
  {
    sectionLabel: "PRODUCT",
    items: [
      { label: "Studio AI", icon: <Cpu className="h-4 w-4" />, hasChevron: true },
      { label: "Converse AI", icon: <MessageSquare className="h-4 w-4" />, hasChevron: true },
    ],
  },
  {
    sectionLabel: "PLATFORM",
    items: [
      { label: "Platform", icon: <Server className="h-4 w-4" />, hasChevron: true },
    ],
  },
]

const toolsGroup: SectionGroup = {
  sectionLabel: "TOOLS",
  items: [
    {
      sectionLabel: "COMPANY",
      items: [
        { label: "Vendor Costing Report", icon: <FileText className="h-4 w-4" /> },
      ],
    } as any,
  ],
}

function NavItemRow({ item, onClick, isExpanded, pathname }: { item: NavItem; onClick?: () => void; isExpanded?: boolean; pathname?: string }) {
  const isActive = item.href ? pathname === item.href : false
  const inner = (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-1.5 rounded-lg cursor-pointer text-sm transition-colors",
        item.isSubItem && "pl-8",
        isActive
          ? "bg-[#EEF2FF] text-[#4F46E5] font-medium"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      {item.icon && (
        <span className={cn("flex-shrink-0", isActive ? "text-[#4F46E5]" : "text-gray-500")}>
          {item.icon}
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.hasChevron && (
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200",
            isExpanded && "rotate-90"
          )}
        />
      )}
    </div>
  )
  return item.href ? <Link href={item.href}>{inner}</Link> : inner
}

function TimelineSubItems({ children, pathname }: { children: NavItem[]; pathname: string }) {
  return (
    <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 mb-1 space-y-0.5">
      {children.map((child) => {
        const isActive = child.href ? pathname === child.href : false
        return child.href ? (
          <Link key={child.label} href={child.href}>
            <div className={cn(
              "flex items-center gap-2.5 py-1.5 pr-3 rounded-lg cursor-pointer text-sm transition-colors",
              isActive ? "text-[#4F46E5] font-medium" : "text-gray-500 hover:text-gray-700"
            )}>
              <span className={cn(
                "w-1.5 h-1.5 rounded-full flex-shrink-0 -ml-[0.4rem]",
                isActive ? "bg-[#4F46E5]" : "bg-gray-400"
              )} />
              <span className="truncate">{child.label}</span>
            </div>
          </Link>
        ) : null
      })}
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  function toggleExpanded(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const topItems = navGroups[0].items

  return (
    <aside className="w-[220px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {/* Top-level items */}
        {topItems.map((item) => {
          const hasTimeline = item.timelineStyle === true
          const isExpanded = expanded[item.label] ?? false

          return (
            <div key={item.label}>
              <NavItemRow
                item={item}
                isExpanded={hasTimeline ? isExpanded : undefined}
                onClick={hasTimeline ? () => toggleExpanded(item.label) : undefined}
                pathname={pathname}
              />
              {/* ARR Dashboard style children (no href, existing style) */}
              {item.children && !hasTimeline && item.children.map((child) => (
                <NavItemRow key={child.label} item={child} pathname={pathname} />
              ))}
              {/* Timeline style children (Pre live / Post live) */}
              {hasTimeline && isExpanded && (
                <TimelineSubItems children={item.children!} pathname={pathname} />
              )}
            </div>
          )
        })}

        {/* Analytics & Review section */}
        <div className="pt-4 pb-1">
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Analytics &amp; Review
          </p>
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Company
          </p>
          {(navGroups[1].items[0] as any).items.map((item: NavItem) => (
            <NavItemRow key={item.label} item={item} />
          ))}
        </div>

        {/* Product section */}
        <div className="pt-2 pb-1">
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Product
          </p>
          {navGroups[2].items.map((item) => (
            <NavItemRow key={item.label} item={item} />
          ))}
        </div>

        {/* Platform section */}
        <div className="pt-2 pb-1">
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Platform
          </p>
          {navGroups[3].items.map((item) => (
            <NavItemRow key={item.label} item={item} />
          ))}
        </div>

        {/* Tools section */}
        <div className="pt-2 pb-1">
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Tools
          </p>
          <p className="px-3 text-[10px] font-semibold text-gray-400 tracking-widest uppercase mb-1">
            Company
          </p>
          {(toolsGroup.items[0] as any).items.map((item: NavItem) => (
            <NavItemRow key={item.label} item={item} />
          ))}
        </div>
      </nav>
    </aside>
  )
}
