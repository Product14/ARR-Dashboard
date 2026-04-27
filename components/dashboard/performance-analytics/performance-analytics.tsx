"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { fetchPerformanceOverviewData } from "@/lib/api-service"
import { transformApiDataToMetrics } from "@/lib/data-transformers"
import type { ApiRevenueData } from "@/types/dashboard"

// ========== TYPESCRIPT INTERFACES ==========
interface TrendData {
  value: string
  direction: "up" | "down"
  color: "green" | "red" | "orange"
}

interface MetricData {
  title: string
  primaryValue: string
  primaryLabel?: string
  secondaryValue?: string
  secondaryLabel?: string
  trend: TrendData
  secondaryTrend?: TrendData
  variant?: "default" | "success"
  valueColor?: string
  primaryThisMonth?: string
  secondaryThisMonth?: string
}

interface PerformanceAnalyticsProps {
  title?: string
  data?: MetricData[]
  filters?: string[]
  onFilterClick?: (filter: string) => void
  className?: string
  useApiData?: boolean
  apiFilters?: Record<string, any>
}

// ========== INLINE ICONS ==========
const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.0001 13.2899C9.88896 13.2899 9.78479 13.2724 9.68757 13.2374C9.59035 13.203 9.50007 13.1441 9.41674 13.0607L5.56257 9.20656C5.40979 9.05379 5.33702 8.86268 5.34424 8.63323C5.35091 8.40434 5.43063 8.21351 5.58341 8.06073C5.73618 7.90795 5.93063 7.83156 6.16674 7.83156C6.40285 7.83156 6.59729 7.90795 6.75007 8.06073L10.0001 11.3107L13.2709 8.0399C13.4237 7.88712 13.6148 7.81406 13.8442 7.82073C14.0731 7.82795 14.264 7.90795 14.4167 8.06073C14.5695 8.21351 14.6459 8.40795 14.6459 8.64406C14.6459 8.88017 14.5695 9.07462 14.4167 9.2274L10.5834 13.0607C10.5001 13.1441 10.4098 13.203 10.3126 13.2374C10.2154 13.2724 10.1112 13.2899 10.0001 13.2899V13.2899Z"
      fill="rgba(0,0,0,0.6)"
    />
  </svg>
)

const ArrowIcon = ({ color, direction }: { color: string; direction: "up" | "down" }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: direction === "up" ? "rotate(-90deg)" : "rotate(270deg)",
    }}
  >
    <path
      d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// ========== LOADING COMPONENTS ==========
const LoadingSkeleton = () => (
  <div className="flex-1 min-w-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-5 flex flex-col gap-3 py-4 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-24"></div>
    <div className="flex gap-4 items-center w-full">
      <div className="flex-1 flex flex-col gap-1 min-w-[130px]">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-px h-full bg-[rgba(0,0,0,0.1)]" />
      <div className="flex-1 flex flex-col gap-1 min-w-[130px]">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  </div>
)

const HealthScoreLoadingSkeleton = () => (
  <div className="rounded-xl px-4 flex flex-col gap-3 py-4 animate-pulse bg-gray-100 border border-gray-200" style={{ width: "164px" }}>
    <div className="h-4 bg-gray-200 rounded w-20"></div>
    <div className="flex flex-col gap-1">
      <div className="h-6 bg-gray-200 rounded w-12"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
)

const ErrorDisplay = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
    <p className="text-red-600 text-sm mb-3">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
)

// ========== COMPONENT PARTS ==========
const FilterButton = ({
  label,
  onClick,
}: {
  label: string
  onClick?: () => void
}) => (
  <div
    className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors py-1.5 w-fit"
    onClick={onClick}
  >
    <span className="text-[14px] text-[rgba(0,0,0,0.6)] font-normal">{label}</span>
    <div className="w-5 h-5">
      <ChevronDownIcon />
    </div>
  </div>
)

const TrendIndicator = ({
  trend,
  thisMonthValue,
  opacity = 0.6,
}: {
  trend: TrendData
  thisMonthValue?: string
  opacity?: number
}) => {
  const colorMap = {
    green: "#027a48",
    red: "#d27b74",
    orange: "#b42318",
  }

  const color = colorMap[trend.color]

  if (thisMonthValue) {
    return (
      <div className="flex items-center gap-1" style={{ opacity }}>
        <span className="text-[12px] font-medium text-[rgba(0,0,0,0.6)]">
          <span className="font-medium text-slate-900">{thisMonthValue}</span>
          <span className="font-light text-slate-800"> this Month</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1" style={{ opacity }}>
      <div className="w-3 h-3 flex items-center justify-center">
        <ArrowIcon color={color} direction={trend.direction} />
      </div>
      <span className="text-[12px] font-medium" style={{ color }}>
        <span className="font-bold">{trend.value}</span>
        <span> vs Last Month</span>
      </span>
    </div>
  )
}

const getHealthScoreVariant = (score: number): "health-red" | "health-yellow" | "health-green" => {
  if (score >= 0 && score < 4) return "health-red"
  if (score >= 4 && score < 7) return "health-yellow"
  return "health-green"
}

const MetricCard = ({ data }: { data: MetricData }) => {
  const isSuccess = data.variant === "success"

  const isHealthScore = data.title === "Health Score"

  if (isHealthScore) {
    const scoreValue = Number.parseFloat(data.primaryValue)
    const healthVariant = getHealthScoreVariant(scoreValue)

    const healthStyles = {
      "health-red": {
        background: "#fef2f2",
        border: "rgba(239, 68, 68, 0.4)",
        textColor: "#dc2626",
      },
      "health-yellow": {
        background: "#fffbeb",
        border: "rgba(245, 158, 11, 0.4)",
        textColor: "#d97706",
      },
      "health-green": {
        background: "#f6fdfa",
        border: "rgba(18,183,106,0.4)",
        textColor: "#027a48",
      },
    }

    const currentStyle = healthStyles[healthVariant]

    return (
      <div
        className="rounded-xl flex flex-col gap-3 py-4 px-3"
        style={{
          width: "164px",
          backgroundColor: currentStyle.background,
          border: `1px solid ${currentStyle.border}`,
        }}
      >
        <div className="text-[14px] text-[rgba(0,0,0,0.6)] capitalize tracking-[0.56px] font-light">{data.title}</div>
        <div className="flex flex-col gap-1">
          <div className="text-[24px] font-semibold leading-[1.2]" style={{ color: currentStyle.textColor }}>
            {data.primaryValue}
          </div>
          <TrendIndicator trend={data.trend} opacity={0.6} />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 bg-white border border-[rgba(0,0,0,0.1)] rounded-xl p-5 flex flex-col gap-3 py-4">
      <div className="text-[14px] text-[rgba(0,0,0,0.6)] capitalize tracking-[0.56px] font-light">{data.title}</div>

      <div className="flex gap-4 items-center w-full">
        {/* Left side - Main metric */}
        <div className="flex-1 flex flex-col gap-1 min-w-[80px]">
          <div className="flex items-end gap-1">
            <span
              className="text-[24px] font-semibold leading-[1.2] truncate"
              style={{ color: data.valueColor || "#645cff" }}
            >
              {data.primaryValue}
            </span>
            {data.primaryLabel && (
              <span
                className="text-[14px] leading-[1.4] whitespace-nowrap"
                style={{ color: data.valueColor || "#645cff" }}
              >
                {data.primaryLabel}
              </span>
            )}
          </div>
          <TrendIndicator trend={data.trend} thisMonthValue={data.primaryThisMonth} opacity={0.6} />
        </div>

        {/* Divider */}
        <div className="w-px h-full bg-[rgba(0,0,0,0.1)]" />

        {/* Right side - Secondary metric */}
        <div className="flex-1 flex flex-col gap-1 min-w-[80px]">
          <div className="flex items-end gap-1">
            <span
              className="text-[24px] font-semibold leading-[1.2] truncate"
              style={{
                color: data.title === "Contracted Live" ? data.valueColor || "#645cff" : "rgba(0,0,0,0.6)",
              }}
            >
              {data.secondaryValue}
            </span>
            {data.secondaryLabel && (
              <span
                className="text-[14px] leading-[1.4] whitespace-nowrap"
                style={{
                  color: data.title === "Contracted Live" ? data.valueColor || "#645cff" : "rgba(0,0,0,0.6)",
                }}
              >
                {data.secondaryLabel}
              </span>
            )}
          </div>
          <TrendIndicator
            trend={data.secondaryTrend || data.trend}
            thisMonthValue={data.secondaryThisMonth}
            opacity={data.secondaryTrend?.color === "red" ? 1 : 0.6}
          />
        </div>
      </div>
    </div>
  )
}

export const PerformanceHeader = ({
  title,
  filters,
  onFilterClick,
  onFiltersApply,
  onResetFilters,
  hasActiveFilters = false,
  appliedFilters = {},
}: {
  title: string
  filters: string[]
  onFilterClick?: (filter: string) => void
  onFiltersApply?: (filterData: { size?: string; region?: string; type?: string; subType?: string }) => void
  onResetFilters?: () => void
  hasActiveFilters?: boolean
  appliedFilters?: { size?: string; region?: string; type?: string; subType?: string }
}) => {
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState<string>("")
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [selectedType, setSelectedType] = useState<string>("")
  const [showSubTypeDropdown, setShowSubTypeDropdown] = useState(false)
  const [selectedSubType, setSelectedSubType] = useState<string>("")
  const [showSizeDropdown, setShowSizeDropdown] = useState(false)
  const [selectedSize, setSelectedSize] = useState<string>("")

  // Refs for click outside detection
  const regionDropdownRef = useRef<HTMLDivElement>(null)
  const regionButtonRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const typeButtonRef = useRef<HTMLDivElement>(null)
  const subTypeDropdownRef = useRef<HTMLDivElement>(null)
  const subTypeButtonRef = useRef<HTMLDivElement>(null)
  const sizeDropdownRef = useRef<HTMLDivElement>(null)
  const sizeButtonRef = useRef<HTMLDivElement>(null)

  const regionOptions = ["AMER", "EMEA", "APAC", "Others"]
  const typeOptions = [
    "Partner",
    "Car Rental Leasing", 
    "Auction Platform",
    "Marketplace",
    "Individual Dealer",
    "Group Dealer"
  ]
  const subTypeOptions = [
    "Independent Dealer",
    "Franchise Dealer"
  ]
  const sizeOptions = ["XL", "M", "L", "S", "XS"]

  // Check if Sub Type should be enabled
  const isSubTypeEnabled = selectedType === "Group Dealer" || selectedType === "Individual Dealer"

  // Sync local state with applied filters
  useEffect(() => {
    // Reset all selections first to handle cases where filters are removed
    setSelectedRegion(appliedFilters.region || "")
    setSelectedSize(appliedFilters.size || "")
    setSelectedSubType(appliedFilters.subType || "")
    
    if (appliedFilters.type) {
      // Convert API type back to UI type for display
      const uiType = typeOptions.find(t => convertTypeToAccountType(t) === appliedFilters.type)
      setSelectedType(uiType || "")
    } else {
      setSelectedType("")
    }
  }, [appliedFilters])

  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region)
  }

  const handleRegionCancel = () => {
    setSelectedRegion("")
    setShowRegionDropdown(false)
  }

  const handleTypeSelect = (type: string) => {
    setSelectedType(type)
    // Reset sub type when type changes and it's not a dealer type
    if (type !== "Group Dealer" && type !== "Individual Dealer") {
      setSelectedSubType("")
    }
  }

  const handleTypeCancel = () => {
    setSelectedType("")
    setSelectedSubType("") // Clear sub type when type is cancelled
    setShowTypeDropdown(false)
  }

  const handleSubTypeSelect = (subType: string) => {
    setSelectedSubType(subType)
  }

  const handleSubTypeCancel = () => {
    setSelectedSubType("")
    setShowSubTypeDropdown(false)
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
  }

  const handleSizeCancel = () => {
    setSelectedSize("")
    setShowSizeDropdown(false)
  }


  // Helper function to convert UI type values to API account_type values
  const convertTypeToAccountType = (type: string): string => {
    const typeMapping: Record<string, string> = {
      "Partner": "PARTNER",
      "Car Rental Leasing": "CAR_RENTAL_LEASING", 
      "Auction Platform": "AUCTION_PLATFORM",
      "Marketplace": "MARKETPLACE",
      "Individual Dealer": "INDIVIDUAL_DEALER",
      "Group Dealer": "GROUP_DEALER"
    }
    return typeMapping[type] || type
  }

  const handleRegionApply = () => {
    if (selectedRegion) {
      onFiltersApply?.({ region: selectedRegion })
    }
    setShowRegionDropdown(false)
  }

  const handleTypeApply = () => {
    if (selectedType) {
      const accountType = convertTypeToAccountType(selectedType)
      onFiltersApply?.({ type: accountType })
    }
    setShowTypeDropdown(false)
  }

  const handleSizeApply = () => {
    if (selectedSize) {
      onFiltersApply?.({ size: selectedSize })
    }
    setShowSizeDropdown(false)
  }

  const handleSubTypeApply = () => {
    if (selectedSubType) {
      onFiltersApply?.({ subType: selectedSubType })
    }
    setShowSubTypeDropdown(false)
  }

  const handleResetFilters = () => {
    // Reset local filter states
    setSelectedRegion("")
    setSelectedType("")
    setSelectedSubType("")
    setSelectedSize("")
    setShowRegionDropdown(false)
    setShowTypeDropdown(false)
    setShowSubTypeDropdown(false)
    setShowSizeDropdown(false)
    // Call the parent reset function
    onResetFilters?.()
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      // Check region dropdown
      const isClickInsideRegionDropdown = regionDropdownRef.current && regionDropdownRef.current.contains(target)
      const isClickOnRegionButton = regionButtonRef.current && regionButtonRef.current.contains(target)
      
      if (!isClickInsideRegionDropdown && !isClickOnRegionButton) {
        setShowRegionDropdown(false)
      }

      // Check type dropdown
      const isClickInsideTypeDropdown = typeDropdownRef.current && typeDropdownRef.current.contains(target)
      const isClickOnTypeButton = typeButtonRef.current && typeButtonRef.current.contains(target)
      
      if (!isClickInsideTypeDropdown && !isClickOnTypeButton) {
        setShowTypeDropdown(false)
      }

      // Check sub type dropdown
      const isClickInsideSubTypeDropdown = subTypeDropdownRef.current && subTypeDropdownRef.current.contains(target)
      const isClickOnSubTypeButton = subTypeButtonRef.current && subTypeButtonRef.current.contains(target)
      
      if (!isClickInsideSubTypeDropdown && !isClickOnSubTypeButton) {
        setShowSubTypeDropdown(false)
      }

      // Check size dropdown
      const isClickInsideSizeDropdown = sizeDropdownRef.current && sizeDropdownRef.current.contains(target)
      const isClickOnSizeButton = sizeButtonRef.current && sizeButtonRef.current.contains(target)
      
      if (!isClickInsideSizeDropdown && !isClickOnSizeButton) {
        setShowSizeDropdown(false)
      }
    }

    if (showRegionDropdown || showTypeDropdown || showSubTypeDropdown || showSizeDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRegionDropdown, showTypeDropdown, showSubTypeDropdown, showSizeDropdown])

  return (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-[16px] text-[rgba(0,0,0,0.9)] font-normal">{title}</h2>

    <div className="flex gap-2">
        {filters.map((filter) => {
          if (filter === "Region") {
            return (
              <div key={filter} className="relative">
                <div
                  ref={regionButtonRef}
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors py-1.5 w-fit"
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                >
                  <span className="text-[14px] text-[rgba(0,0,0,0.6)] font-normal">
                    {selectedRegion || appliedFilters.region || filter}
                  </span>
                  <div className="w-5 h-5">
                    <ChevronDownIcon />
                  </div>
                  {/* Applied filter badge */}
                  {appliedFilters.region && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">1</span>
                    </div>
                  )}
                </div>
                {showRegionDropdown && (
                  <div ref={regionDropdownRef} className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] p-4">
                    {/* Region Options */}
                    <div className="space-y-3">
                      {regionOptions.map((region) => (
                        <div 
                          key={region}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleRegionSelect(region)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                            {selectedRegion === region && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{region}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                      <button 
                        onClick={handleRegionCancel}
                        className="flex-1 py-2 px-4 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleRegionApply}
                        className="flex-1 py-2 px-4 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          if (filter === "Type") {
            return (
              <div key={filter} className="relative">
                <div
                  ref={typeButtonRef}
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors py-1.5 w-fit"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                >
                  <span className="text-[14px] text-[rgba(0,0,0,0.6)] font-normal">
                    {selectedType || (appliedFilters.type && typeOptions.find(t => convertTypeToAccountType(t) === appliedFilters.type)) || filter}
                  </span>
                  <div className="w-5 h-5">
                    <ChevronDownIcon />
                  </div>
                  {/* Applied filter badge */}
                  {appliedFilters.type && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">1</span>
                    </div>
                  )}
                </div>
                {showTypeDropdown && (
                  <div ref={typeDropdownRef} className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[250px] p-4">
                    {/* Type Options */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {typeOptions.map((type) => (
                        <div 
                          key={type}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleTypeSelect(type)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                            {selectedType === type && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{type}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                      <button 
                        onClick={handleTypeCancel}
                        className="flex-1 py-2 px-4 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleTypeApply}
                        className="flex-1 py-2 px-4 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          if (filter === "Sub type") {
            return (
              <div key={filter} className="relative">
                <div
                  ref={subTypeButtonRef}
                  className={`bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-2 flex items-center justify-between transition-colors py-1.5 w-fit ${
                    isSubTypeEnabled 
                      ? 'cursor-pointer hover:bg-gray-50' 
                      : 'cursor-not-allowed bg-gray-100 opacity-60'
                  }`}
                  onClick={() => isSubTypeEnabled && setShowSubTypeDropdown(!showSubTypeDropdown)}
                >
                  <span className={`text-[14px] font-normal ${
                    isSubTypeEnabled 
                      ? 'text-[rgba(0,0,0,0.6)]' 
                      : 'text-[rgba(0,0,0,0.4)]'
                  }`}>
                    {selectedSubType || appliedFilters.subType || filter}
                  </span>
                  <div className="w-5 h-5">
                    <ChevronDownIcon />
                  </div>
                  {/* Applied filter badge */}
                  {appliedFilters.subType && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">1</span>
                    </div>
                  )}
                </div>
                {showSubTypeDropdown && isSubTypeEnabled && (
                  <div ref={subTypeDropdownRef} className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] p-4">
                    {/* Sub Type Options */}
                    <div className="space-y-3">
                      {subTypeOptions.map((subType) => (
                        <div 
                          key={subType}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleSubTypeSelect(subType)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                            {selectedSubType === subType && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{subType}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                      <button 
                        onClick={handleSubTypeCancel}
                        className="flex-1 py-2 px-4 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubTypeApply}
                        className="flex-1 py-2 px-4 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
                    }
          if (filter === "Size") {
            return (
              <div key={filter} className="relative">
                <div
                  ref={sizeButtonRef}
                  className="bg-white border border-[rgba(0,0,0,0.1)] rounded-lg px-2 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors py-1.5 w-fit"
                  onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                >
                  <span className="text-[14px] text-[rgba(0,0,0,0.6)] font-normal">
                    {selectedSize || appliedFilters.size || filter}
                  </span>
                  <div className="w-5 h-5">
                    <ChevronDownIcon />
                  </div>
                  {/* Applied filter badge */}
                  {appliedFilters.size && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">1</span>
                    </div>
                  )}
                </div>
                {showSizeDropdown && (
                  <div ref={sizeDropdownRef} className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px] p-4">
                    {/* Size Options */}
                    <div className="space-y-3">
                      {sizeOptions.map((size) => (
                        <div 
                          key={size}
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => handleSizeSelect(size)}
                        >
                          <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center">
                            {selectedSize === size && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">{size}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 mt-6">
                      <button 
                        onClick={handleSizeCancel}
                        className="flex-1 py-2 px-4 text-sm text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSizeApply}
                        className="flex-1 py-2 px-4 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          }

          return (
        <FilterButton
          key={filter}
          label={filter}
          onClick={() => onFilterClick?.(filter)}
        />
          )
        })}
        
        {/* Reset Filters Button */}
        {onResetFilters && (
          <button
            onClick={hasActiveFilters ? handleResetFilters : undefined}
            disabled={!hasActiveFilters}
            className={`rounded-lg px-3 py-1.5 flex items-center gap-2 transition-all duration-200 ${
              hasActiveFilters 
                ? "bg-blue-600 border border-blue-600 text-white cursor-pointer hover:bg-blue-700 hover:border-blue-700 shadow-sm"
                : "bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <svg 
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={hasActiveFilters ? "text-white" : "text-gray-400"}
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            <span className={`text-[14px] font-normal ${
              hasActiveFilters ? "text-white" : "text-gray-400"
            }`}>
              Reset
            </span>
          </button>
        )}
    </div>
  </div>
)
}

// ========== SNAPSHOT CARD ==========
export const SnapshotCard = ({
  date = "As of March 19, 2026",
  carr = { value: "₹10.9M", delta: "+₹787K" },
  larr = { value: "₹7.2M", delta: "+₹501K" },
  churned,
}: {
  date?: string
  carr?: { value: string; delta: string }
  larr?: { value: string; delta: string }
  churned?: { value: string }
}) => (
  <div className="inline-flex bg-white border border-gray-200 rounded-2xl overflow-hidden flex-col">
    <div className="bg-gray-100 px-4 py-1 w-full">
      <span className="text-[11px] text-gray-500 font-normal">{date}</span>
    </div>
    <div className="flex items-center gap-0 px-4 py-3">
      {churned ? (
        <div className="flex items-baseline gap-1.5">
          <span className="text-[15px] font-semibold text-red-400">Churned ARR:</span>
          <span className="text-[22px] font-bold leading-tight text-red-500">{churned.value}</span>
        </div>
      ) : (
        <>
          {/* CARR */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold text-gray-500">CARR:</span>
            <span className="text-[22px] font-bold leading-tight text-[#2563eb]">{carr.value}</span>
            <span className="text-[11px] font-semibold text-[#027a48]">{carr.delta}</span>
          </div>
          {/* Divider */}
          <div className="w-px self-stretch bg-gray-200 mx-4" />
          {/* LARR */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-semibold text-gray-500">LARR:</span>
            <span className="text-[22px] font-bold leading-tight text-[#027a48]">{larr.value}</span>
            <span className="text-[11px] font-semibold text-[#027a48]">{larr.delta}</span>
          </div>
        </>
      )}
    </div>
  </div>
)

export const PeriodCard = ({
  period = "Mar 1 - Mar 19",
  grr = { value: "67 %", color: "#d27b74" },
  nrr = { value: "112 %", color: "#027a48" },
}: {
  period?: string
  grr?: { value: string; color?: string }
  nrr?: { value: string; color?: string }
}) => (
  <div className="inline-flex bg-white border border-gray-200 rounded-2xl overflow-hidden flex-col">
    <div className="bg-gray-100 px-4 py-1 w-full">
      <span className="text-[11px] text-gray-500 font-normal">{period}</span>
    </div>
    <div className="flex items-center gap-0 px-4 py-3">
      {/* GRR */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold text-gray-500">GRR:</span>
        <span className="text-[22px] font-bold leading-tight" style={{ color: grr.color || "#d27b74" }}>{grr.value}</span>
      </div>
      {/* Divider */}
      <div className="w-px self-stretch bg-gray-200 mx-4" />
      {/* NRR */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold text-gray-500">NRR:</span>
        <span className="text-[22px] font-bold leading-tight" style={{ color: nrr.color || "#027a48" }}>{nrr.value}</span>
      </div>
    </div>
  </div>
)

export const CountsCard = ({
  enterpriseCount,
  rooftopCount,
}: {
  enterpriseCount: number
  rooftopCount: number
}) => (
  <div className="inline-flex bg-white border border-gray-200 rounded-2xl overflow-hidden flex-col">
    <div className="bg-gray-100 px-4 py-1 w-full">
      <span className="text-[11px] text-gray-500 font-normal">Accounts</span>
    </div>
    <div className="flex items-center gap-0 px-4 py-3">
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold text-gray-500">Enterprises:</span>
        <span className="text-[22px] font-bold leading-tight text-gray-700">{enterpriseCount}</span>
      </div>
      <div className="w-px self-stretch bg-gray-200 mx-4" />
      <div className="flex items-baseline gap-1.5">
        <span className="text-[15px] font-semibold text-gray-500">Rooftops:</span>
        <span className="text-[22px] font-bold leading-tight text-gray-700">{rooftopCount}</span>
      </div>
    </div>
  </div>
)

// ========== MAIN COMPONENT ==========
export const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  title = "Performance Overview",
  data,
  filters = ["Size", "Type", "Geography", "Today"],
  onFilterClick,
  className = "",
  useApiData = true,
  apiFilters = {},
}) => {
  const [apiData, setApiData] = useState<MetricData[] | null>(null)
  const [loading, setLoading] = useState(useApiData)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!useApiData) return

    try {
      setLoading(true)
      setError(null)
      
      console.log('=== PERFORMANCE OVERVIEW API CALL START ===')
      console.log('Performance Overview - API Filters:', apiFilters)
      
      const response = await fetchPerformanceOverviewData({ filters: apiFilters })
      
      console.log('Performance Overview - Full API Response:', JSON.stringify(response, null, 2))
      console.log('Performance Overview - Response Type:', typeof response)
      console.log('Performance Overview - Response Keys:', Object.keys(response || {}))
      
      // The API response has the data nested under response.data
      // We need to pass the nested data to the transformer
      const apiRevenueData = response.data
      
      console.log('Performance Overview - Extracted Data for Transformer:', JSON.stringify(apiRevenueData, null, 2))
      console.log('Performance Overview - Extracted Data Type:', typeof apiRevenueData)
      console.log('Performance Overview - Extracted Data Keys:', Object.keys(apiRevenueData || {}))
      
      // Verify this is Revenue API data and NOT Enterprise API data
      // Revenue API data should have healthScore, contractLive, actualLive, churn at the root level
      // Enterprise API data has a 'data' property with an array inside
      if (apiRevenueData && 'data' in apiRevenueData && Array.isArray(apiRevenueData.data)) {
        console.error('Performance Overview - ERROR: Received Enterprise API data structure!')
        console.error('Performance Overview - This should be Revenue API data with healthScore, contractLive, actualLive, churn')
        throw new Error('Wrong API data structure: Expected Revenue API data but received Enterprise API data structure')
      }
      
      // Additional validation: Check if we have the expected Revenue API structure
      if (!apiRevenueData || !apiRevenueData.healthScore || !apiRevenueData.contractLive || !apiRevenueData.actualLive || !apiRevenueData.churn) {
        console.error('Performance Overview - ERROR: Invalid Revenue API data structure!')
        console.error('Performance Overview - Expected fields: healthScore, contractLive, actualLive, churn')
        console.error('Performance Overview - Received fields:', apiRevenueData ? Object.keys(apiRevenueData) : 'null/undefined')
        throw new Error('Invalid Revenue API response: Missing required fields (healthScore, contractLive, actualLive, churn)')
      }
      
      const transformedData = transformApiDataToMetrics(apiRevenueData)
      console.log('Performance Overview - Transformed Data:', transformedData)
      console.log('=== PERFORMANCE OVERVIEW API CALL END ===')
      
      // If transformer returns null, it means the data structure is invalid
      if (transformedData === null) {
        throw new Error('Invalid API response format. Unable to parse performance data from Revenue API.')
      }
      
      setApiData(transformedData)
    } catch (err) {
      console.error('Failed to fetch performance overview data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data')
      // Explicitly set apiData to null to ensure no fallback data is shown
      setApiData(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [useApiData, JSON.stringify(apiFilters)])

  const handleFilterClick = (filter: string) => {
    onFilterClick?.(filter)
    // You could update apiFilters here based on the filter selection
  }

  const handleRetry = () => {
    fetchData()
  }
  // When using API data, only use apiData - never fall back to prop data
  // When not using API data, use the prop data
  const metricsData = useApiData ? apiData : data

  // Handle loading state
  if (loading) {
    return (
      <div
        className={`bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] w-full overflow-hidden font-sans ${className}`}
      >
        <div className="p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row lg:py-3 lg:px-3 sm:gap-4">
          <LoadingSkeleton />
          <HealthScoreLoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      </div>
    )
  }

  // Handle error state or no data available
  if (error || (useApiData && !loading && !apiData) || (!useApiData && !data)) {
    const errorMessage = error || 'No performance data available. Please check your connection and try again.'
    return (
      <div
        className={`bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] w-full overflow-hidden font-sans ${className}`}
      >
        <div className="p-3 sm:p-4 lg:p-5">
          <ErrorDisplay message={errorMessage} onRetry={handleRetry} />
        </div>
      </div>
    )
  }

  // This should not happen due to the checks above, but adding safety check
  if (!metricsData) {
    return (
      <div
        className={`bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] w-full overflow-hidden font-sans ${className}`}
      >
        <div className="p-3 sm:p-4 lg:p-5">
          <ErrorDisplay message="No performance data available" onRetry={handleRetry} />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white rounded-[20px] border border-[rgba(0,0,0,0.1)] w-full overflow-hidden font-sans ${className}`}
    >
      <div className="p-3 sm:p-4 lg:p-5 flex flex-col sm:flex-row lg:py-3 lg:px-3 sm:gap-4">
        <SnapshotCard />
        {metricsData.map((metric, index) => (
          <MetricCard key={index} data={metric} />
        ))}
      </div>
    </div>
  )
}

export type { MetricData, TrendData, PerformanceAnalyticsProps }
