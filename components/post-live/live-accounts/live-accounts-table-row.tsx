import { forwardRef } from "react"
import { ImageIcon, VideoTourIcon, Spin360Icon, AdminLinkIcon, CopyIcon } from "@/components/icons/dashboard-icons"
import { toast } from "@/hooks/use-toast"
import { getEnvironmentFromLocation } from "@/lib/utils"
import type { RooftopsData } from "./live-accounts-table"

interface RooftopsTableRowProps {
  data: RooftopsData
  onRowClick?: (data: RooftopsData) => void
}

export const RooftopsTableRow = forwardRef<HTMLTableRowElement, RooftopsTableRowProps>(
  function RooftopsTableRow({ data, onRowClick }, ref) {
  
  const getStageBadgeStyles = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "contract initiated":
      case "contract-initiated":
        return "bg-blue-100 text-blue-600 border-blue-200"
      case "contracted":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "onboarding":
        return "bg-orange-100 text-orange-600 border-orange-200"
      case "live":
        return "bg-green-100 text-green-600 border-green-200"
      case "churned":
        return "bg-red-100 text-red-600 border-red-200"
      case "plg":
        return "bg-purple-100 text-purple-600 border-purple-200"
      case "signup":
        return "bg-cyan-100 text-cyan-600 border-cyan-200"
      case "new":
        return "bg-indigo-100 text-indigo-600 border-indigo-200"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getStageDisplayText = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "contract initiated":
      case "contract-initiated":
        return "Contract Initiated"
      case "contracted":
        return "Contracted"
      case "onboarding":
        return "Onboarding"
      case "live":
        return "Live"
      case "churned":
        return "Churned"
      case "plg":
        return "PLG"
      case "signup":
        return "Signup"
      case "new":
        return "New"
      default:
        return stage
    }
  }

  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case "Group Dealer":
      case "GROUP_DEALER":
        return "bg-blue-100 text-blue-600"
      case "Marketplace":
      case "MARKETPLACE":
        return "bg-green-100 text-green-700"
      case "Partner":
      case "PARTNER":
        return "bg-yellow-100 text-yellow-700"
      case "Auction Platform":
      case "AUCTION_PLATFORM":
        return "bg-pink-100 text-pink-600"
      case "Individual Dealer":
      case "INDIVIDUAL_DEALER":
        return "bg-purple-100 text-purple-600"
      case "Car Rental Leasing":
      case "CAR_RENTAL_LEASING":
        return "bg-green-100 text-green-700"
      case "Franchise Dealer":
      case "FRANCHISE_DEALER":
        return "bg-orange-100 text-orange-700"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeDisplayText = (type: string) => {
    switch (type) {
      case "GROUP_DEALER":
        return "Group Dealer"
      case "MARKETPLACE":
        return "Marketplace"
      case "PARTNER":
        return "Partner"
      case "AUCTION_PLATFORM":
        return "Auction Platform"
      case "INDIVIDUAL_DEALER":
        return "Individual Dealer"
      case "CAR_RENTAL_LEASING":
        return "Car Rental Leasing"
      case "FRANCHISE_DEALER":
        return "Franchise Dealer"
      default:
        return type // Return as-is if it's already in display format
    }
  }

  const getSubTypeBadgeStyles = (subType: string) => {
    switch (subType) {
      case "Independent":
      case "INDEPENDENT":
      case "INDEPENDENT_DEALER":
        return "bg-[#EEFCD5] text-[#3B6E23] border border-[#BFEDA0]"
      case "Franchise":
      case "FRANCHISE":
      case "FRANCHISE_DEALER":
        return "bg-[#FEF8E1] text-[#7C4F1A] border border-[#F0D98A]"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getSubTypeDisplayText = (subType: string) => {
    switch (subType) {
      case "INDEPENDENT":
      case "INDEPENDENT_DEALER":
      case "Independent Dealer":
        return "Independent"
      case "FRANCHISE":
      case "FRANCHISE_DEALER":
      case "Franchise Dealer":
        return "Franchise"
      default:
        return subType
    }
  }

  const getHealthScoreBadgeStyles = (score: number) => {
    if (score >= 1 && score <= 4) {
      return "bg-red-100 text-red-800 border-red-200"
    } else if (score >= 5 && score <= 7) {
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    } else if (score >= 8 && score <= 10) {
      return "bg-green-100 text-green-800 border-green-200"
    } else {
      return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getConverseAIBadgeStyles = (status: string | null) => {
    if (!status) return "text-gray-400" // No badge styling for null values
    
    // Use purple styling for any actual API values
    return "bg-purple-100 text-purple-800 border-purple-200"
  }

  const getConverseAIDisplayText = (status: string | null) => {
    if (!status) return "-"
    return status // Show the actual API value
  }

  const getPlanBadgeStyles = (plan: string) => {
    switch (plan) {
      case "Essential":
      case "ESSENTIAL":
        return "bg-blue-100 text-blue-800"
      case "Growth":
      case "GROWTH":
        return "bg-purple-100 text-purple-800"
      case "Enterprise":
      case "ENTERPRISE":
        return "bg-blue-100 text-blue-800"
      case "Comprehensive":
      case "COMPREHENSIVE":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPlanDisplayText = (plan: string) => {
    switch (plan) {
      case "ESSENTIAL":
        return "Essential"
      case "GROWTH":
        return "Growth"
      case "ENTERPRISE":
        return "Enterprise"
      case "COMPREHENSIVE":
        return "Comprehensive"
      default:
        return plan // Return as-is if it's already in display format
    }
  }


  const getPaymentFrequencyBadgeStyles = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "monthly":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "quarterly":
        return "bg-green-100 text-green-800 border-green-200"
      case "annually":
      case "annual":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "semi-annually":
      case "semi-annual":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "weekly":
        return "bg-cyan-100 text-cyan-800 border-cyan-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentFrequencyDisplayText = (frequency: string) => {
    if (!frequency || frequency === "-") return "-"
    return frequency
  }

  const getPocBadgeStyles = (pocName: string | null) => {
    if (!pocName) return "text-gray-400"
    
    // Use custom purple styling for POC badges to match the design
    return "border border-[#F0EDF4] text-[#6A5F79]"
  }

  const getPocDisplayText = (pocName: string | null) => {
    if (!pocName) return "-"
    return pocName
  }

  const PersonIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
      <path 
        d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z" 
        fill="currentColor"
      />
      <path 
        d="M7 8.5C4.51472 8.5 2.5 10.5147 2.5 13H11.5C11.5 10.5147 9.48528 8.5 7 8.5Z" 
        fill="currentColor"
      />
    </svg>
  )


  const renderMediaIcons = (product: string | string[]) => {
    const products = Array.isArray(product) ? product : [product]
    const icons = []
    
    // Check for Images
    const hasImages = products.some(prod => {
      const prodLower = prod.toLowerCase()
      return prodLower.includes('images') || prodLower.includes('image')
    })
    
    // Check for Videos
    const hasVideos = products.some(prod => {
      const prodLower = prod.toLowerCase()
      return prodLower.includes('videos') || prodLower.includes('video')
    })
    
    // Check for 360
    const has360 = products.some(prod => {
      const prodLower = prod.toLowerCase()
      return prodLower.includes('360')
    })
    
    // Add media icons
    if (hasImages) {
      icons.push(
        <div 
          key="images"
          className="w-4 h-4 flex items-center justify-center"
          title="Images"
        >
          <ImageIcon />
        </div>
      )
    }
    
    if (hasVideos) {
      icons.push(
        <div 
          key="videos"
          className="w-4 h-4 flex items-center justify-center"
          title="Videos"
        >
          <VideoTourIcon />
        </div>
      )
    }
    
    if (has360) {
      icons.push(
        <div 
          key="360"
          className="w-4 h-4 flex items-center justify-center"
          title="360° View"
        >
          <Spin360Icon />
        </div>
      )
    }
    
    return icons
  }

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on buttons or links
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('a')) {
      return
    }
    onRowClick?.(data)
  }

  return (
    <tr 
      ref={ref} 
      className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
      onClick={handleRowClick}
    >
      {/* Rooftops */}
      <td className="px-3 py-2 h-9 w-[282px] max-w-[282px] min-w-[282px] sticky left-0 bg-white z-10 shadow-[inset_-1px_0_0_0_#f3f4f6]" style={{width: '282px !important', minWidth: '282px !important', maxWidth: '282px !important'}}>
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const env = getEnvironmentFromLocation();
                const baseUrl = env === 'uat' ? 'https://uat-console.spyne.xyz' : 'https://console.spyne.ai';
                const consoleUrl = `${baseUrl}/home?vehicle_type=pre-owned&team_id=%5B${data.teamId}%5D&enterprise_id=${data.enterpriseId}`;
                window.open(consoleUrl, '_blank');
              }}
              className="text-sm font-medium text-blue-800 hover:text-blue-600 hover:underline transition-colors text-left"
              title="Open Console"
            >
              {data.name}
            </button>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(String(data.teamId ?? ''))
                  toast({ description: "Copied Team ID", className: "border-gray-700 text-gray-800 p-2 pr-4 text-xs" })
                } catch (err) {
                  // Fallback for insecure contexts or permission denial
                  const textArea = document.createElement('textarea')
                  textArea.value = String(data.teamId ?? '')
                  textArea.style.position = 'fixed'
                  textArea.style.left = '-9999px'
                  document.body.appendChild(textArea)
                  textArea.focus()
                  textArea.select()
                  try {
                    document.execCommand('copy')
                    toast({ description: "Copied Team ID", className: "border-gray-700 text-gray-800 p-2 pr-4 text-xs" })
                  } finally {
                    document.body.removeChild(textArea)
                  }
                }
              }}
              className="flex-shrink-0 w-[22px] h-[22px] flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              title="Copy Team ID"
            >
              <CopyIcon />
            </button>
            <button
              onClick={() => {
                const adminUrl = `https://admin.spyne.ai/admintools?selectedTab=dealerview&enterprise_id=${data.enterpriseId}&rooftop_id=${data.teamId}`;
                window.open(adminUrl, '_blank');
              }}
              className="flex-shrink-0 w-[22px] h-[22px] flex items-center justify-center hover:bg-gray-100 rounded transition-colors"
              title="Open Admin Tools"
            >
              <AdminLinkIcon />
            </button>
          </div>
        </div>
      </td>

      {/* Enterprise Name column removed for grouped view */}

      {/* Stage */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center border ${getStageBadgeStyles(data.stage)}`}>
          {getStageDisplayText(data.stage)}
        </span>
      </td>

      {/* Type */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getTypeBadgeStyles(data.type)}`}>
          {getTypeDisplayText(data.type)}
        </span>
      </td>

      {/* Sub Type */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-[8px] h-[24px] items-center ${getSubTypeBadgeStyles(data.subType)}`}>
          {getSubTypeDisplayText(data.subType)}
        </span>
      </td>

      {/* Health Score */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[120px] w-fit">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center border ${getHealthScoreBadgeStyles(data.healthScore)}`}>
          {data.healthScore != null ? (Number.isInteger(data.healthScore) ? data.healthScore : Number(data.healthScore).toFixed(1)) : "-"}
        </span>
      </td>

      {/* Studio AI */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[220px] w-fit">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center ${getPlanBadgeStyles(data.plan)}`}>
            {getPlanDisplayText(data.plan)}
          </span>
          <div className="flex items-center gap-1">
            {renderMediaIcons(data.product)}
          </div>
        </div>
      </td>

      {/* Converse AI */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[140px] w-fit">
        {data.converseAI ? (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center border ${getConverseAIBadgeStyles(data.converseAI)}`}>
            {getConverseAIDisplayText(data.converseAI)}
          </span>
        ) : (
          <span className={`inline-flex px-2 py-1 text-xs font-medium h-[22px] items-center ${getConverseAIBadgeStyles(data.converseAI)}`}>
            {getConverseAIDisplayText(data.converseAI)}
          </span>
        )}
      </td>

      {/* AE POC */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[140px] w-fit">
        {data.aePoc ? (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center gap-1 bg-[#F0EDF4] ${getPocBadgeStyles(data.aePoc)}`}>
            <PersonIcon />
            {getPocDisplayText(data.aePoc)}
          </span>
        ) : (
          <span className={`inline-flex px-2 py-1 text-xs font-medium h-[22px] items-center ${getPocBadgeStyles(data.aePoc)}`}>
            {getPocDisplayText(data.aePoc)}
          </span>
        )}
      </td>

      {/* OB POC */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[140px] w-fit">
        {data.obPoc ? (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center gap-1 bg-[#F0EDF4] ${getPocBadgeStyles(data.obPoc)}`}>
            <PersonIcon />
            {getPocDisplayText(data.obPoc)}
          </span>
        ) : (
          <span className={`inline-flex px-2 py-1 text-xs font-medium h-[22px] items-center ${getPocBadgeStyles(data.obPoc)}`}>
            {getPocDisplayText(data.obPoc)}
          </span>
        )}
      </td>

      {/* CS POC */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[140px] w-fit">
        {data.csPoc ? (
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center gap-1 bg-[#F0EDF4] ${getPocBadgeStyles(data.csPoc)}`}>
            <PersonIcon />
            {getPocDisplayText(data.csPoc)}
          </span>
        ) : (
          <span className={`inline-flex px-2 py-1 text-xs font-medium h-[22px] items-center ${getPocBadgeStyles(data.csPoc)}`}>
            {getPocDisplayText(data.csPoc)}
          </span>
        )}
      </td>

      {/* Region */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-purple-100 text-purple-800 h-[22px] items-center">
          {data.region || "-"}
        </span>
      </td>

      {/* Country */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.country || "-"}</span>
      </td>

      {/* Contracted Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.contractedDate || "-"}</span>
      </td>

      {/* Contracted ARR */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm font-semibold text-green-600">{data.contractedARR || "-"}</span>
      </td>

      {/* Onboarding Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.obDate || "-"}</span>
      </td>

      {/* Live Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.liveDate || "-"}</span>
      </td>

      {/* Live ARR */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm font-semibold text-blue-600">{data.liveARR || "-"}</span>
      </td>

      {/* Contract End Date */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.contractEndDate || "-"}</span>
      </td>

      {/* Contract Duration */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.contractDuration || "-"}</span>
      </td>

      {/* Payment Frequency */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md h-[22px] items-center border ${getPaymentFrequencyBadgeStyles(data.paymentFrequency)}`}>
          {getPaymentFrequencyDisplayText(data.paymentFrequency)}
        </span>
      </td>

      {/* Lock In Period */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.lockInPeriod || "-"}</span>
      </td>

      {/* VINs Used (This Month) */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[220px] w-fit">
        <span className="text-sm text-gray-700">{data.averageUsage || "-"}</span>
      </td>

      {/* VINs Used (Last Month) */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[220px] w-fit">
        <span className="text-sm text-gray-700">{data.lastMonthUsage || "-"}</span>
      </td>

      {/* Avg. VIN Usage (Last 3 Months) */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[260px] w-fit">
        <span className="text-sm text-gray-700">{data.last3MonthsAvgUsage || "-"}</span>
      </td>

      {/* Open Tickets */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          data.openTickets === 0 
            ? 'bg-green-100 text-green-800' 
            : data.openTickets <= 2 
              ? 'bg-yellow-100 text-yellow-800' 
              : 'bg-red-100 text-red-800'
        }`}>
          {data.openTickets}
        </span>
      </td>

      {/* Total Tickets */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {(data.openTickets || 0) + (data.closedTickets || 0)}
        </span>
      </td>

      {/* Team ID */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.teamId || "-"}</span>
      </td>

      {/* Enterprise ID */}
      <td className="px-3 py-2 border-r border-gray-100 h-9 min-w-[180px] w-fit">
        <span className="text-sm text-gray-700">{data.enterpriseId || "-"}</span>
      </td>
    </tr>
  )
})
