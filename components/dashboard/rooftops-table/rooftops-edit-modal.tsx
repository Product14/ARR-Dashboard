"use client"

import { useState, useEffect } from "react"
import type { RooftopsData } from "./rooftops-table"
import { ImageIcon, VideoTourIcon, Spin360Icon, WebsiteIcon, InventoryIcon } from "@/components/icons/dashboard-icons"

interface RooftopsEditModalProps {
  isOpen: boolean
  onClose: () => void
  data: RooftopsData | null
  onSave?: (updatedData: RooftopsData) => void
}

// Fields that require a reason for change
const criticalFields: (keyof RooftopsData)[] = [
  'type', 
  'subType', 
  'plan', 
  'product', 
  'converseAI', 
  'obPoc', 
  'aePoc', 
  'csPoc', 
  'contractedARR',
  'liveARR'
]

// Move FormSection outside the main component
const FormSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-6">
    <h3 className="text-base font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {children}
    </div>
  </div>
)

// Move FormField outside the main component
const FormField = ({ 
  label, 
  value,
  fullWidth = false,
  editable = false,
  field,
  type = "text",
  options,
  onInputChange,
  onReasonChange,
  fieldReasons,
  criticalFieldsChanged
}: { 
  label: string
  value: string | number
  fullWidth?: boolean
  editable?: boolean
  field?: keyof RooftopsData
  type?: string
  options?: string[]
  onInputChange?: (field: keyof RooftopsData, value: string | number) => void
  onReasonChange?: (field: string, reason: string) => void
  fieldReasons?: { [key: string]: string }
  criticalFieldsChanged?: string[]
}) => {
  const isCriticalField = field && criticalFields.includes(field)
  const showReasonInput = isCriticalField && criticalFieldsChanged?.includes(field as string)
  
  return (
    <div className={fullWidth ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {editable && field && onInputChange ? (
        <>
          {options ? (
            <select
              value={value}
              onChange={(e) => onInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            >
              {options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => onInputChange(field, e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
            />
          )}
          {showReasonInput && onReasonChange && fieldReasons && (
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Reason for changing {label} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={fieldReasons[field as string] || ""}
                onChange={(e) => onReasonChange(field as string, e.target.value)}
                placeholder={`Why are you changing ${label.toLowerCase()}?`}
                rows={2}
                className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 transition-colors resize-none ${
                  !fieldReasons[field as string]?.trim()
                    ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
              />
              {!fieldReasons[field as string]?.trim() && (
                <p className="mt-1 text-xs text-red-600">
                  Please provide a reason for this change
                </p>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="w-full px-3 py-2 border rounded-md text-sm bg-gray-50 text-gray-900 border-gray-200">
          {value || "-"}
        </div>
      )}
    </div>
  )
}

// Move ConverseAISelector outside the main component
const ConverseAISelector = ({
  formData,
  isConverseAIDropdownOpen,
  setIsConverseAIDropdownOpen,
  handleConverseAIToggle,
  criticalFieldsChanged,
  fieldReasons,
  onReasonChange
}: {
  formData: RooftopsData
  isConverseAIDropdownOpen: boolean
  setIsConverseAIDropdownOpen: (open: boolean) => void
  handleConverseAIToggle: (option: string) => void
  criticalFieldsChanged: string[]
  fieldReasons: { [key: string]: string }
  onReasonChange: (field: string, reason: string) => void
}) => {
  const converseAIOptions = ['Sales Inbound', 'Sales Outbound', 'Service Inbound', 'Service Outbound']
  const currentConverseAI = formData.converseAI ? (Array.isArray(formData.converseAI) ? formData.converseAI : formData.converseAI.split(',').map(s => s.trim())) : []
  
  const showReasonInput = criticalFieldsChanged.includes('converseAI')

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Converse AI
      </label>
      <button
        type="button"
        onClick={() => setIsConverseAIDropdownOpen(!isConverseAIDropdownOpen)}
        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {currentConverseAI.length > 0 ? (
            currentConverseAI.map((option, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-indigo-100 text-indigo-800">
                {option}
              </span>
            ))
          ) : (
            <span className="text-gray-500">Select Converse AI options...</span>
          )}
        </div>
        <svg className={`w-4 h-4 transition-transform ${isConverseAIDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isConverseAIDropdownOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 space-y-1">
            {converseAIOptions.map((option) => (
              <label key={option} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentConverseAI.includes(option)}
                  onChange={() => handleConverseAIToggle(option)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      {showReasonInput && (
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Reason for changing Converse AI <span className="text-red-500">*</span>
          </label>
          <textarea
            value={fieldReasons['converseAI'] || ""}
            onChange={(e) => onReasonChange('converseAI', e.target.value)}
            placeholder="Why are you changing the Converse AI options?"
            rows={2}
            className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 transition-colors resize-none ${
              !fieldReasons['converseAI']?.trim()
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {!fieldReasons['converseAI']?.trim() && (
            <p className="mt-1 text-xs text-red-600">
              Please provide a reason for this change
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Move MediaSelector outside the main component
const MediaSelector = ({
  formData,
  isMediaDropdownOpen,
  setIsMediaDropdownOpen,
  handleMediaToggle,
  criticalFieldsChanged,
  fieldReasons,
  onReasonChange
}: {
  formData: RooftopsData
  isMediaDropdownOpen: boolean
  setIsMediaDropdownOpen: (open: boolean) => void
  handleMediaToggle: (mediaType: string) => void
  criticalFieldsChanged: string[]
  fieldReasons: { [key: string]: string }
  onReasonChange: (field: string, reason: string) => void
}) => {
  const currentProducts = Array.isArray(formData.product) ? formData.product : [formData.product]
  const hasImages = currentProducts.some(p => p.toLowerCase().includes('image'))
  const hasVideos = currentProducts.some(p => p.toLowerCase().includes('video'))
  const has360 = currentProducts.some(p => p.toLowerCase().includes('360'))
  const hasWebsite = currentProducts.some(p => p.toLowerCase().includes('website'))
  const hasInventory = currentProducts.some(p => p.toLowerCase().includes('inventory'))
  const showReasonInput = criticalFieldsChanged.includes('product')

  return (
    <div className="relative w-full">
    <label className="block text-sm font-medium text-gray-700 mb-1">
        Media
      </label>
      <button
        type="button"
        onClick={() => setIsMediaDropdownOpen(!isMediaDropdownOpen)}
        className="w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors text-left flex items-center justify-between"
      >
        <div className="flex items-center gap-2 flex-wrap">
          {hasImages && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-blue-100 text-blue-800">
              <ImageIcon />
              Images
            </span>
          )}
          {hasVideos && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-purple-100 text-purple-800">
              <VideoTourIcon />
              Videos
            </span>
          )}
          {has360 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-green-100 text-green-800">
              <Spin360Icon />
              360°
            </span>
          )}
          {hasWebsite && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-cyan-100 text-cyan-800">
              <WebsiteIcon />
              Website
            </span>
          )}
          {hasInventory && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-orange-100 text-orange-800">
              <InventoryIcon />
              Inventory
            </span>
          )}
          {!hasImages && !hasVideos && !has360 && !hasWebsite && !hasInventory && (
            <span className="text-gray-500">Select media types...</span>
          )}
        </div>
        <svg className={`w-4 h-4 transition-transform ${isMediaDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isMediaDropdownOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <div className="p-2 space-y-1">
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={hasImages}
                onChange={() => handleMediaToggle('Images')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <ImageIcon />
                Images
              </span>
            </label>
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={hasVideos}
                onChange={() => handleMediaToggle('Videos')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <VideoTourIcon />
                Videos
              </span>
            </label>
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={has360}
                onChange={() => handleMediaToggle('360°')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <Spin360Icon />
                360°
              </span>
            </label>
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={hasWebsite}
                onChange={() => handleMediaToggle('Website')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <WebsiteIcon />
                Website
              </span>
            </label>
            <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={hasInventory}
                onChange={() => handleMediaToggle('Inventory')}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="inline-flex items-center gap-1 text-sm text-gray-700">
                <InventoryIcon />
                Inventory
              </span>
    </label>
          </div>
        </div>
      )}
      
      {showReasonInput && (
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Reason for changing Media <span className="text-red-500">*</span>
          </label>
          <textarea
            value={fieldReasons['product'] || ""}
            onChange={(e) => onReasonChange('product', e.target.value)}
            placeholder="Why are you changing the media selection?"
            rows={2}
            className={`w-full px-3 py-2 border rounded-md text-sm bg-white text-gray-900 transition-colors resize-none ${
              !fieldReasons['product']?.trim()
                ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
          {!fieldReasons['product']?.trim() && (
            <p className="mt-1 text-xs text-red-600">
              Please provide a reason for this change
            </p>
          )}
        </div>
      )}
    </div>
  )
}

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

export function RooftopsEditModal({ isOpen, onClose, data, onSave }: RooftopsEditModalProps) {
  const [formData, setFormData] = useState<RooftopsData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [isMediaDropdownOpen, setIsMediaDropdownOpen] = useState(false)
  const [isConverseAIDropdownOpen, setIsConverseAIDropdownOpen] = useState(false)
  const [fieldReasons, setFieldReasons] = useState<{ [key: string]: string }>({})
  const [criticalFieldsChanged, setCriticalFieldsChanged] = useState<string[]>([])

  useEffect(() => {
    if (isOpen && data) {
      setFormData({ ...data })
      setHasChanges(false)
      setFieldReasons({})
      setCriticalFieldsChanged([])
    }
  }, [isOpen, data])

  if (!isOpen || !data || !formData) return null

  const handleInputChange = (field: keyof RooftopsData, value: string | number) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null)
    setHasChanges(true)
    
    // Track if a critical field was changed
    if (criticalFields.includes(field) && !criticalFieldsChanged.includes(field as string)) {
      setCriticalFieldsChanged(prev => [...prev, field as string])
    }
  }

  const handleReasonChange = (field: string, reason: string) => {
    setFieldReasons(prev => ({ ...prev, [field]: reason }))
  }

  const handleMediaToggle = (mediaType: string) => {
    const currentProducts = Array.isArray(formData.product) ? formData.product : [formData.product]
    const productMap: { [key: string]: string } = {
      'Images': 'Images',
      'Videos': 'Videos',
      '360°': '360',
      'Website': 'Website',
      'Inventory': 'Inventory'
    }
    
    const productValue = productMap[mediaType]
    const hasProduct = currentProducts.some(p => p.toLowerCase().includes(productValue.toLowerCase()))
    
    let newProducts: string[]
    if (hasProduct) {
      // Remove the product
      newProducts = currentProducts.filter(p => !p.toLowerCase().includes(productValue.toLowerCase()))
    } else {
      // Add the product
      newProducts = [...currentProducts, productValue]
    }
    
    // Ensure at least one product is selected
    if (newProducts.length === 0) {
      return
    }
    
    setFormData(prev => prev ? { ...prev, product: newProducts } : null)
    setHasChanges(true)
    
    // Track critical field change for media/product
    if (!criticalFieldsChanged.includes('product')) {
      setCriticalFieldsChanged(prev => [...prev, 'product'])
    }
  }

  const handleConverseAIToggle = (option: string) => {
    const currentConverseAI = formData.converseAI 
      ? (Array.isArray(formData.converseAI) 
          ? formData.converseAI 
          : formData.converseAI.split(',').map(s => s.trim())) 
      : []
    
    let newConverseAI: string[]
    if (currentConverseAI.includes(option)) {
      // Remove the option
      newConverseAI = currentConverseAI.filter(o => o !== option)
    } else {
      // Add the option
      newConverseAI = [...currentConverseAI, option]
    }
    
    // Convert array to comma-separated string for storage
    const converseAIValue = newConverseAI.length > 0 ? newConverseAI.join(', ') : null
    
    setFormData(prev => prev ? { ...prev, converseAI: converseAIValue } : null)
    setHasChanges(true)
    
    // Track critical field change for converseAI
    if (!criticalFieldsChanged.includes('converseAI')) {
      setCriticalFieldsChanged(prev => [...prev, 'converseAI'])
    }
  }

  const handleTestAccountToggle = () => {
    const newValue = !formData.isTestAccount
    setFormData(prev => prev ? { ...prev, isTestAccount: newValue } : null)
    setHasChanges(true)
  }

  const handleSave = () => {
    // Check if all critical fields that were changed have reasons
    const missingReasons = criticalFieldsChanged.filter(field => !fieldReasons[field]?.trim())
    if (missingReasons.length > 0) {
      return
    }
    
    if (formData && onSave) {
      // Include the reasons for changes in the save callback if needed
      onSave(formData)
      console.log('Field-specific reasons:', fieldReasons)
      console.log('Fields changed:', criticalFieldsChanged)
    }
    setHasChanges(false)
    setFieldReasons({})
    setCriticalFieldsChanged([])
    onClose()
  }

  const handleCancel = () => {
    setFormData(data ? { ...data } : null)
    setHasChanges(false)
    setFieldReasons({})
    setCriticalFieldsChanged([])
    onClose()
  }

  const hasAllReasonsForChangedFields = () => {
    return criticalFieldsChanged.every(field => fieldReasons[field]?.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col z-10">
          {/* Header */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between px-6 py-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Rooftop Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {formData.name}
                </p>
              </div>
              <div className="flex items-center gap-4">
                 <button
                   onClick={onClose}
                   className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                 >
                   <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                 </button>
               </div>
            </div>
            
            {/* Test Account Banner */}
            {formData.isTestAccount && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900">
                      🧪 TEST ACCOUNT
                    </p>
                    <p className="text-xs text-amber-700 mt-0.5">
                      This rooftop is marked as a test account and will be excluded from production analytics and revenue calculations.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Basic Information */}
            <FormSection title="Basic Information">
              <FormField
                label="Rooftop Name"
                value={formData.name}
                editable={true}
                field="name"
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Enterprise Name"
                value={formData.enterpriseName}
                editable={true}
                field="enterpriseName"
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-md border ${getStageBadgeStyles(formData.stage)}`}>
                  {formData.stage}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Health Score
                </label>
                <span className={`inline-flex px-3 py-2 text-sm font-medium rounded-md border ${getHealthScoreBadgeStyles(formData.healthScore)}`}>
                  {formData.healthScore}
                </span>
              </div>
              <FormField
                label="Type"
                value={formData.type}
                editable={true}
                field="type"
                options={['Group Dealer', 'Individual Dealer', 'Marketplace', 'Partner', 'Auction Platform', 'Car Rental Leasing', 'Franchise Dealer']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Sub Type"
                value={formData.subType}
                editable={true}
                field="subType"
                options={['Independent', 'Franchise', '-']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Studio Plan"
                value={formData.plan}
                editable={true}
                field="plan"
                options={['Essential', 'Growth', 'Enterprise', 'Comprehensive', 'Gold', 'Silver', 'Bronze']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <MediaSelector
                formData={formData}
                isMediaDropdownOpen={isMediaDropdownOpen}
                setIsMediaDropdownOpen={setIsMediaDropdownOpen}
                handleMediaToggle={handleMediaToggle}
                criticalFieldsChanged={criticalFieldsChanged}
                fieldReasons={fieldReasons}
                onReasonChange={handleReasonChange}
              />
              <ConverseAISelector
                formData={formData}
                isConverseAIDropdownOpen={isConverseAIDropdownOpen}
                setIsConverseAIDropdownOpen={setIsConverseAIDropdownOpen}
                handleConverseAIToggle={handleConverseAIToggle}
                criticalFieldsChanged={criticalFieldsChanged}
                fieldReasons={fieldReasons}
                onReasonChange={handleReasonChange}
              />
            </FormSection>

            {/* Point of Contacts */}
            <FormSection title="Point of Contacts">
              <FormField
                label="AE POC"
                value={formData.aePoc || "-"}
                editable={true}
                field="aePoc"
                options={['Saurabh', 'Saarthak', 'Ashley Riccio', 'Jay', 'Archit', '-']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="OB POC"
                value={formData.obPoc || "-"}
                editable={true}
                field="obPoc"
                options={['Saurabh', 'Saarthak', 'Ashley Riccio', 'Jay', 'Archit', '-']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="CS POC"
                value={formData.csPoc || "-"}
                editable={true}
                field="csPoc"
                options={['Saurabh', 'Saarthak', 'Ashley Riccio', 'Jay', 'Archit', '-']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
            </FormSection>

            {/* IDs & Location */}
            <FormSection title="IDs & Location">
              <FormField
                label="Team ID"
                value={formData.teamId}
              />
              <FormField
                label="Enterprise ID"
                value={formData.enterpriseId}
              />
              <FormField
                label="Region"
                value={formData.region}
                editable={true}
                field="region"
                options={['AMER', 'EMEA', 'APAC']}
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Country"
                value={formData.country}
                editable={true}
                field="country"
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
            </FormSection>

            {/* Financial Information */}
            <FormSection title="Financial Information">
              <FormField
                label="Contracted ARR"
                value={formData.contractedARR}
                editable={true}
                field="contractedARR"
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Live ARR"
                value={formData.liveARR}
                editable={true}
                field="liveARR"
                onInputChange={handleInputChange}
                onReasonChange={handleReasonChange}
                fieldReasons={fieldReasons}
                criticalFieldsChanged={criticalFieldsChanged}
              />
              <FormField
                label="Payment Frequency"
                value={formData.paymentFrequency}
              />
            </FormSection>

            {/* Contract Information */}
            <FormSection title="Contract Information">
              <FormField
                label="Contracted Date"
                value={formData.contractedDate}
              />
              <FormField
                label="Onboarding Date"
                value={formData.obDate}
              />
              <FormField
                label="Live Date"
                value={formData.liveDate}
              />
              <FormField
                label="Contract End Date"
                value={formData.contractEndDate}
              />
              <FormField
                label="Contract Duration"
                value={formData.contractDuration}
              />
              <FormField
                label="Lock-in Period"
                value={formData.lockInPeriod}
              />
            </FormSection>

            {/* Usage Information */}
            <FormSection title="Usage Information">
              <FormField
                label="VINs Used (This Month)"
                value={formData.averageUsage}
              />
              <FormField
                label="VINs Used (Last Month)"
                value={formData.lastMonthUsage}
              />
              <FormField
                label="Avg. VIN Usage (Last 3 Months)"
                value={formData.last3MonthsAvgUsage}
              />
            </FormSection>

            {/* Support & Tickets */}
            <FormSection title="Support & Tickets">
              <FormField
                label="Open Tickets"
                value={formData.openTickets}
              />
              <FormField
                label="Closed Tickets"
                value={formData.closedTickets}
              />
              <FormField
                label="Total Tickets"
                value={formData.totalTickets}
              />
            </FormSection>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white shadow-lg">
            <div className="flex items-center">
              <button
                onClick={handleTestAccountToggle}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 min-w-[120px]"
              >
                Move to Test
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 min-w-[100px]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges || (criticalFieldsChanged.length > 0 && !hasAllReasonsForChangedFields())}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-lg transition-all duration-200 min-w-[120px] ${
                  hasChanges && (criticalFieldsChanged.length === 0 || hasAllReasonsForChangedFields())
                    ? 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
      </div>
    </div>
  )
}