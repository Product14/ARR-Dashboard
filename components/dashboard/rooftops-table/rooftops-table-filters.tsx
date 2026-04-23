"use client"

import React, { useState, useRef, useEffect } from "react"

interface FilterOption {
  label: string
  value: string
}

interface RooftopsTableFiltersProps {
  onSearchChange: (search: string) => void
  onPlanChange: (plan: string) => void
  onTypeChange?: (types: string[]) => void
  onSubTypeChange?: (subTypes: string[]) => void
  onProductChange?: (products: string[]) => void
  onRooftopTypeChange?: (types: string[]) => void
  onStageChange?: (stages: string[]) => void
  onLiveArrChange?: (filters: { operator: string; amount: number | number[] }[]) => void
  onContractedArrChange?: (filters: { operator: string; amount: number | number[] }[]) => void
  onHealthScoreChange?: (ranges: { min: number; max: number }[]) => void
  onRegionChange?: (regions: string[]) => void
  onAccountTypeToggle?: (accountType: 'live' | 'test') => void
  onAtRiskChange?: (active: boolean) => void
  onPeriodChange?: (period: { type: 'mtd' | 'qtd' | 'custom'; startDate?: string; endDate?: string }) => void
  onMediaChange?: (media: string[]) => void
  onAgentChange?: (agents: string[]) => void
  onDealerSegmentChange?: (segments: string[]) => void
  activeTab?: "all" | "studio_ai" | "vini_ai"
  atRiskActive?: boolean
  mediaValues?: string[]
  agentValues?: string[]
  searchValue: string
  planValue: string
  typeValue?: string[]
  subTypeValues?: string[]
  productValues?: string[]
  stageValues?: string[]
  liveArrFilters?: { operator: string; amount: number | number[] }[]
  contractedArrFilters?: { operator: string; amount: number | number[] }[]
  healthScoreRanges?: { min: number; max: number }[]
  regionValues?: string[]
  accountType?: 'live' | 'test'
  periodValue?: { type: 'mtd' | 'qtd' | 'custom'; startDate?: string; endDate?: string }
}

export function RooftopsTableFilters({
  onSearchChange,
  onPlanChange,
  onTypeChange,
  onSubTypeChange,
  onProductChange,
  onRooftopTypeChange,
  onStageChange,
  onLiveArrChange,
  onContractedArrChange,
  onHealthScoreChange,
  onRegionChange,
  onAccountTypeToggle,
  onAtRiskChange,
  onPeriodChange,
  onMediaChange,
  onAgentChange,
  onDealerSegmentChange,
  activeTab = "all",
  atRiskActive = false,
  mediaValues = [],
  agentValues = [],
  searchValue,
  planValue,
  typeValue = [],
  subTypeValues = [],
  productValues = [],
  stageValues = [],
  liveArrFilters = [],
  contractedArrFilters = [],
  healthScoreRanges = [],
  regionValues = [],
  accountType = 'live',
  periodValue = { type: 'mtd' },
}: RooftopsTableFiltersProps) {
  // Main bar dropdown states (Stage, Product, Type, Rooftop Type)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [showStageDropdown, setShowStageDropdown] = useState(false)
  const [showRooftopTypeDropdown, setShowRooftopTypeDropdown] = useState(false)
  const [showDealerSegmentDropdown, setShowDealerSegmentDropdown] = useState(false)
  
  // More Filters panel state
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  
  // More Filters dropdown states
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [showSubTypeDropdown, setShowSubTypeDropdown] = useState(false)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showHealthScoreDropdown, setShowHealthScoreDropdown] = useState(false)
  const [showMediaDropdown, setShowMediaDropdown] = useState(false)
  const [showStageInMoreDropdown, setShowStageInMoreDropdown] = useState(false)
  const [showMediaTabDropdown, setShowMediaTabDropdown] = useState(false)
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  
  // Views states
  const [showViewsDropdown, setShowViewsDropdown] = useState(false)
  const [showCreateViewModal, setShowCreateViewModal] = useState(false)
  const [isEditingView, setIsEditingView] = useState(false)
  const [editingViewId, setEditingViewId] = useState<string | null>(null)
  const [savedViews, setSavedViews] = useState<Array<{ id: string; name: string; columns: string[]; filters: any }>>([
    { id: "1", name: "Default View", columns: ["name", "type", "stage", "health", "arr"], filters: {} },
    { id: "2", name: "Sales View", columns: ["name", "arr", "stage", "region"], filters: {} },
  ])
  const [activeView, setActiveView] = useState<{ id: string; name: string; columns: string[]; filters: any } | null>(null)
  const [newViewName, setNewViewName] = useState("")
  const [selectedViewColumns, setSelectedViewColumns] = useState<string[]>(["name", "type", "stage", "health", "arr"])
  const [columnOrder, setColumnOrder] = useState<string[]>(["name", "type", "subtype", "stage", "health", "arr", "contracted_arr", "region", "plan", "products", "contact", "last_activity"])
  const [viewColumnFilters, setViewColumnFilters] = useState<Record<string, any>>({})
  const [openColumnFilterDropdown, setOpenColumnFilterDropdown] = useState<string | null>(null)
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null)
  const [columnSearchQuery, setColumnSearchQuery] = useState("")
  
  // Period / custom date picker state
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false)
  const [customStart, setCustomStart] = useState(periodValue.startDate ?? "")
  const [customEnd, setCustomEnd] = useState(periodValue.endDate ?? "")
  const customDateRef = useRef<HTMLDivElement>(null)
  const endDateInputRef = useRef<HTMLInputElement>(null)
  const fmtDate = (iso: string) => iso.split('-').reverse().join('/')

  // Individual dropdown refs
  const typeDropdownRef = useRef<HTMLDivElement>(null)
  const rooftopTypeDropdownRef = useRef<HTMLDivElement>(null)
  const productDropdownRef = useRef<HTMLDivElement>(null)
  const stageDropdownRef = useRef<HTMLDivElement>(null)
  const moreFiltersRef = useRef<HTMLDivElement>(null)
  const planDropdownRef = useRef<HTMLDivElement>(null)
  const subTypeDropdownRef = useRef<HTMLDivElement>(null)
  const regionDropdownRef = useRef<HTMLDivElement>(null)
  const healthScoreDropdownRef = useRef<HTMLDivElement>(null)
  const mediaDropdownRef = useRef<HTMLDivElement>(null)
  const stageInMoreDropdownRef = useRef<HTMLDivElement>(null)
  const viewsDropdownRef = useRef<HTMLDivElement>(null)
  const mediaTabDropdownRef = useRef<HTMLDivElement>(null)
  const agentDropdownRef = useRef<HTMLDivElement>(null)
  const dealerSegmentDropdownRef = useRef<HTMLDivElement>(null)

  // Local state for filters
  const [selectedTypes, setSelectedTypes] = useState<string[]>(typeValue || [])
  const [selectedRooftopTypes, setSelectedRooftopTypes] = useState<string[]>([])
  const [selectedDealerSegments, setSelectedDealerSegments] = useState<string[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>(planValue || "All")
  const [selectedStages, setSelectedStages] = useState<string[]>(stageValues)
  const [selectedRegions, setSelectedRegions] = useState<string[]>(regionValues)
  const [selectedSubTypes, setSelectedSubTypes] = useState<string[]>(subTypeValues)
  const [selectedProducts, setSelectedProducts] = useState<string[]>(productValues)
  const [selectedHealthScoreRanges, setSelectedHealthScoreRanges] = useState<string[]>([])
  const [selectedMediaTab, setSelectedMediaTab] = useState<string[]>(mediaValues)
  const [selectedAgents, setSelectedAgents] = useState<string[]>(agentValues)

  // Available type options with proper API mapping
  const typeOptions: FilterOption[] = [
    { label: "All", value: "All" },
    { label: "Group Dealer", value: "GROUP_DEALER" },
    { label: "Individual Dealer", value: "INDIVIDUAL_DEALER" },
    { label: "Reseller", value: "RESELLER" },
    { label: "Auction Platform", value: "AUCTION_PLATFORM" },
    { label: "Marketplace", value: "MARKETPLACE" },
    { label: "Car Rental Leasing", value: "CAR_RENTAL_LEASING" },
    { label: "Others", value: "OTHERS" }
  ]

  // Available sub type options based on the API data
  const subTypeOptions: FilterOption[] = [
    { label: "Franchise Dealer", value: "FRANCHISE_DEALER" },
    { label: "Independent Dealer", value: "INDEPENDENT_DEALER" },
  ]

  // Available product options
  const productOptions: FilterOption[] = [
    { label: "Studio AI", value: "studio_ai" },
    { label: "Converse AI", value: "converse_ai" },
  ]

  // Stage options for rooftops (only pre-filtered stages are available)
  const stageOptions: FilterOption[] = [
    { label: "Live", value: "Live" },
    { label: "Onboarding", value: "Onboarding" },
    { label: "Churned", value: "Churned" },
    { label: "Contract Initiated", value: "Contract-Initiated" },
    { label: "Drop Off", value: "Drop-Off" },
    { label: "Contracted", value: "Contracted" },
  ]

  // Region options
  const regionOptions: FilterOption[] = [
    { label: "AMER", value: "AMER" },
    { label: "EMEA", value: "EMEA" },
    { label: "APAC", value: "APAC" },
    { label: "LATAM", value: "LATAM" },
  ]

  // Health Score range options
  const healthScoreRangeOptions: FilterOption[] = [
    { label: "Poor (0-3)", value: "0-3" },
    { label: "Fair (4-6)", value: "4-6" },
    { label: "Good (7-8)", value: "7-8" },
    { label: "Excellent (9-10)", value: "9-10" },
  ]

  // Available columns for Views
  const availableColumns = [
    { label: "Rooftop Name", value: "name", hasFilter: false, required: true },
    { label: "Type", value: "type", hasFilter: true, filterType: "select", options: typeOptions },
    { label: "Sub Type", value: "subtype", hasFilter: true, filterType: "multiselect", options: subTypeOptions },
    { label: "Stage", value: "stage", hasFilter: true, filterType: "multiselect", options: stageOptions },
    { label: "Health Score", value: "health", hasFilter: true, filterType: "multiselect", options: healthScoreRangeOptions },
    { label: "Live ARR", value: "arr", hasFilter: false },
    { label: "Contracted ARR", value: "contracted_arr", hasFilter: false },
    { label: "Region", value: "region", hasFilter: true, filterType: "multiselect", options: regionOptions },
    { label: "Plan", value: "plan", hasFilter: true, filterType: "select", options: [{ label: "All", value: "All" }, { label: "Essential", value: "Essential" }, { label: "Growth", value: "Growth" }, { label: "Comprehensive", value: "Comprehensive" }] },
    { label: "Products", value: "products", hasFilter: true, filterType: "multiselect", options: productOptions },
    { label: "Contact", value: "contact", hasFilter: false },
    { label: "Last Activity", value: "last_activity", hasFilter: false },
  ]

  // Views handlers
  const handleCreateNewView = () => {
    setShowViewsDropdown(false)
    setShowCreateViewModal(true)
    setIsEditingView(false)
    setEditingViewId(null)
    setNewViewName("")
    const defaultSelected = ["name", "type", "stage", "health", "arr"]
    setSelectedViewColumns(defaultSelected)
    setViewColumnFilters({})
    setOpenColumnFilterDropdown(null)
    setColumnSearchQuery("")
    // Reset column order with checked columns first
    const allColumns = ["name", "type", "subtype", "stage", "health", "arr", "contracted_arr", "region", "plan", "products", "contact", "last_activity"]
    const checked = allColumns.filter(col => defaultSelected.includes(col))
    const unchecked = allColumns.filter(col => !defaultSelected.includes(col))
    setColumnOrder([...checked, ...unchecked])
  }

  const handleEditView = (view: { id: string; name: string; columns: string[]; filters: any }) => {
    setShowViewsDropdown(false)
    setShowCreateViewModal(true)
    setIsEditingView(true)
    setEditingViewId(view.id)
    setNewViewName(view.name)
    setSelectedViewColumns(view.columns)
    setViewColumnFilters(view.filters || {})
    setOpenColumnFilterDropdown(null)
    setColumnSearchQuery("")
    // Set column order with the view's columns first
    const allColumns = ["name", "type", "subtype", "stage", "health", "arr", "contracted_arr", "region", "plan", "products", "contact", "last_activity"]
    const checked = allColumns.filter(col => view.columns.includes(col))
    const unchecked = allColumns.filter(col => !view.columns.includes(col))
    setColumnOrder([...checked, ...unchecked])
  }

  const handleColumnToggle = (columnValue: string) => {
    // Prevent toggling required columns
    const column = availableColumns.find(col => col.value === columnValue)
    if (column?.required) return
    
    let newSelectedColumns: string[]
    if (selectedViewColumns.includes(columnValue)) {
      newSelectedColumns = selectedViewColumns.filter(col => col !== columnValue)
    } else {
      newSelectedColumns = [...selectedViewColumns, columnValue]
    }
    
    setSelectedViewColumns(newSelectedColumns)
    
    // Reorder: move checked columns to the top
    reorderColumnsWithCheckedFirst(newSelectedColumns)
  }

  const reorderColumnsWithCheckedFirst = (selectedCols: string[]) => {
    const newOrder = [...columnOrder]
    
    // Separate into checked and unchecked
    const checkedColumns = newOrder.filter(col => selectedCols.includes(col))
    const uncheckedColumns = newOrder.filter(col => !selectedCols.includes(col))
    
    // Combine: checked first, then unchecked
    setColumnOrder([...checkedColumns, ...uncheckedColumns])
  }

  const handleDragStart = (columnValue: string) => {
    setDraggedColumn(columnValue)
  }

  const handleDragOver = (e: React.DragEvent, columnValue: string) => {
    e.preventDefault()
    
    if (!draggedColumn || draggedColumn === columnValue) return
    
    const newOrder = [...columnOrder]
    const draggedIndex = newOrder.indexOf(draggedColumn)
    const targetIndex = newOrder.indexOf(columnValue)
    
    // Remove dragged item and insert at target position
    newOrder.splice(draggedIndex, 1)
    newOrder.splice(targetIndex, 0, draggedColumn)
    
    setColumnOrder(newOrder)
  }

  const handleDragEnd = () => {
    setDraggedColumn(null)
  }

  const handleColumnFilterChange = (columnValue: string, filterValue: any) => {
    setViewColumnFilters(prev => ({
      ...prev,
      [columnValue]: filterValue
    }))
  }

  const handleRemoveColumnFilter = (columnValue: string) => {
    setViewColumnFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[columnValue]
      return newFilters
    })
  }

  const handleSaveView = () => {
    if (newViewName.trim()) {
      if (isEditingView && editingViewId) {
        // Update existing view
        setSavedViews(savedViews.map(view => 
          view.id === editingViewId 
            ? { ...view, name: newViewName, columns: selectedViewColumns, filters: viewColumnFilters }
            : view
        ))
        // Update active view if it's the one being edited
        if (activeView?.id === editingViewId) {
          setActiveView({
            id: editingViewId,
            name: newViewName,
            columns: selectedViewColumns,
            filters: viewColumnFilters
          })
        }
      } else {
        // Create new view and auto-apply it
        const newView = {
          id: Date.now().toString(),
          name: newViewName,
          columns: selectedViewColumns,
          filters: viewColumnFilters
        }
        setSavedViews([...savedViews, newView])
        // Auto-apply the newly created view
        setActiveView(newView)
        // TODO: Apply the view's columns and filters to the table
      }
      setShowCreateViewModal(false)
      setIsEditingView(false)
      setEditingViewId(null)
      setNewViewName("")
      setViewColumnFilters({})
    }
  }

  const handleDeleteView = (viewId: string) => {
    setSavedViews(savedViews.filter(view => view.id !== viewId))
    // If the deleted view was active, clear the active view
    if (activeView?.id === viewId) {
      setActiveView(null)
    }
  }

  const handleSelectView = (view: { id: string; name: string; columns: string[]; filters: any }) => {
    setActiveView(view)
    setShowViewsDropdown(false)
    // TODO: Apply the view's columns and filters to the table
  }

  const handleClearView = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveView(null)
    // TODO: Reset table to default view
  }

  // Main bar handlers (applied immediately)
  const handleTypeToggle = (value: string) => {
    setSelectedTypes(prev => {
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      onTypeChange?.(next)
      return next
    })
  }

  const handleRooftopTypeToggle = (value: string) => {
    setSelectedRooftopTypes(prev => {
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      onRooftopTypeChange?.(next)
      return next
    })
  }

  const handleDealerSegmentToggle = (value: string) => {
    setSelectedDealerSegments(prev => {
      const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
      onDealerSegmentChange?.(next)
      return next
    })
  }

  const handleStageToggle = (stage: string) => {
    const newStages = selectedStages.includes(stage)
      ? selectedStages.filter(s => s !== stage)
      : [...selectedStages, stage]
    setSelectedStages(newStages)
    onStageChange?.(newStages)
  }

  const handleProductToggle = (product: string) => {
    const newProducts = selectedProducts.includes(product)
      ? selectedProducts.filter(p => p !== product)
      : [...selectedProducts, product]
    setSelectedProducts(newProducts)
    onProductChange?.(newProducts)
  }

  const handleMediaTabToggle = (value: string) => {
    const next = selectedMediaTab.includes(value)
      ? selectedMediaTab.filter(v => v !== value)
      : [...selectedMediaTab, value]
    setSelectedMediaTab(next)
    onMediaChange?.(next)
  }

  const handleAgentToggle = (value: string) => {
    const next = selectedAgents.includes(value)
      ? selectedAgents.filter(v => v !== value)
      : [...selectedAgents, value]
    setSelectedAgents(next)
    onAgentChange?.(next)
  }

  // More Filters handlers (applied immediately)
  const handlePlanSelect = (planValue: string) => {
    setSelectedPlan(planValue)
    setShowPlanDropdown(false)
    onPlanChange(planValue)
  }

  const handleSubTypeToggle = (subType: string) => {
    const newSubTypes = selectedSubTypes.includes(subType)
      ? selectedSubTypes.filter(st => st !== subType)
      : [...selectedSubTypes, subType]
    setSelectedSubTypes(newSubTypes)
    onSubTypeChange?.(newSubTypes)
  }

  const handleRegionToggle = (region: string) => {
    const newRegions = selectedRegions.includes(region)
      ? selectedRegions.filter(r => r !== region)
      : [...selectedRegions, region]
    setSelectedRegions(newRegions)
    onRegionChange?.(newRegions)
  }

  const handleHealthScoreRangeToggle = (range: string) => {
    const newRanges = selectedHealthScoreRanges.includes(range)
      ? selectedHealthScoreRanges.filter(r => r !== range)
      : [...selectedHealthScoreRanges, range]
    setSelectedHealthScoreRanges(newRanges)
    
    const ranges = newRanges.map(range => {
      const [min, max] = range.split('-').map(Number)
      return { min, max }
    })
    onHealthScoreChange?.(ranges)
  }

  // Check if any more filters are active
  const hasActiveMoreFilters = 
    selectedPlan !== "All" || 
    selectedSubTypes.length > 0 || 
    selectedRegions.length > 0 || 
    selectedHealthScoreRanges.length > 0

  // Count active more filters
  const activeMoreFiltersCount = 
    (selectedPlan !== "All" ? 1 : 0) + 
    selectedSubTypes.length + 
    selectedRegions.length + 
    selectedHealthScoreRanges.length

  // Check if any filters are active (including main bar filters)
  const hasAnyActiveFilters =
    selectedTypes.length > 0 ||
    selectedStages.length > 0 ||
    selectedProducts.length > 0 || 
    hasActiveMoreFilters

  // Reset all filters (both main bar and more filters)
  const handleResetAllFilters = () => {
    // Reset main bar filters
    setSelectedTypes([])
    setSelectedStages([])
    setSelectedProducts([])
    
    // Reset more filters
    setSelectedPlan("All")
    setSelectedSubTypes([])
    setSelectedRegions([])
    setSelectedHealthScoreRanges([])
    
    // Apply all resets
    onTypeChange?.([])
    onStageChange?.([])
    onProductChange?.([])
    onPlanChange("All")
    onSubTypeChange?.([])
    onRegionChange?.([])
    onHealthScoreChange?.([])
  }


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
        // Check each dropdown individually
        const isClickInTypeDropdown = typeDropdownRef.current && typeDropdownRef.current.contains(target)
        const isClickInRooftopTypeDropdown = rooftopTypeDropdownRef.current && rooftopTypeDropdownRef.current.contains(target)
        const isClickInProductDropdown = productDropdownRef.current && productDropdownRef.current.contains(target)
        const isClickInStageDropdown = stageDropdownRef.current && stageDropdownRef.current.contains(target)
        const isClickInViewsDropdown = viewsDropdownRef.current && viewsDropdownRef.current.contains(target)
        const isClickInMediaTabDropdown = mediaTabDropdownRef.current && mediaTabDropdownRef.current.contains(target)
        const isClickInAgentDropdown = agentDropdownRef.current && agentDropdownRef.current.contains(target)
        const isClickInDealerSegmentDropdown = dealerSegmentDropdownRef.current && dealerSegmentDropdownRef.current.contains(target)

        // Close dropdowns that are not being clicked
        if (!isClickInTypeDropdown) setShowTypeDropdown(false)
        if (!isClickInRooftopTypeDropdown) setShowRooftopTypeDropdown(false)
        if (!isClickInProductDropdown) setShowProductDropdown(false)
        if (!isClickInStageDropdown) setShowStageDropdown(false)
        if (!isClickInViewsDropdown) setShowViewsDropdown(false)
        if (!isClickInMediaTabDropdown) setShowMediaTabDropdown(false)
        if (!isClickInAgentDropdown) setShowAgentDropdown(false)
        if (!isClickInDealerSegmentDropdown) setShowDealerSegmentDropdown(false)
    }

    // Add event listener when any dropdown is open
    if (showTypeDropdown || showRooftopTypeDropdown || showProductDropdown || showStageDropdown || showViewsDropdown || showMediaTabDropdown || showAgentDropdown || showDealerSegmentDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTypeDropdown, showRooftopTypeDropdown, showProductDropdown, showStageDropdown, showViewsDropdown, showMediaTabDropdown, showAgentDropdown, showDealerSegmentDropdown])
  
  // Close More Filters modal when clicking outside
  useEffect(() => {
    if (!showMoreFilters) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      // Check if click is inside the more filters panel
      const isClickInMoreFilters = moreFiltersRef.current && moreFiltersRef.current.contains(target)
      
      // Close modal if click is outside
      if (!isClickInMoreFilters) {
        setShowMoreFilters(false)
        setShowPlanDropdown(false)
        setShowSubTypeDropdown(false)
        setShowRegionDropdown(false)
        setShowHealthScoreDropdown(false)
        setShowMediaDropdown(false)
        setShowStageInMoreDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMoreFilters])

  // Close column filter dropdowns when clicking outside (in Create View Modal)
  useEffect(() => {
    if (!showCreateViewModal || !openColumnFilterDropdown) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      
      // Check if click is inside any dropdown
      if (!target.closest('.relative')) {
        setOpenColumnFilterDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCreateViewModal, openColumnFilterDropdown])

  // Initialize column order with checked columns at top on mount
  useEffect(() => {
    const allColumns = ["name", "type", "subtype", "stage", "health", "arr", "contracted_arr", "region", "plan", "products", "contact", "last_activity"]
    const checked = allColumns.filter(col => selectedViewColumns.includes(col))
    const unchecked = allColumns.filter(col => !selectedViewColumns.includes(col))
    setColumnOrder([...checked, ...unchecked])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  // Close custom date picker when clicking outside
  useEffect(() => {
    if (!showCustomDatePicker) return
    const handleClickOutside = (event: MouseEvent) => {
      if (customDateRef.current && !customDateRef.current.contains(event.target as Node)) {
        setShowCustomDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCustomDatePicker])

  // Close internal dropdowns when clicking outside (within the panel)
  useEffect(() => {
    if (!showMoreFilters) return
    
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      
      const isClickInPlanDropdown = planDropdownRef.current && planDropdownRef.current.contains(target)
      const isClickInSubTypeDropdown = subTypeDropdownRef.current && subTypeDropdownRef.current.contains(target)
      const isClickInRegionDropdown = regionDropdownRef.current && regionDropdownRef.current.contains(target)
      const isClickInHealthScoreDropdown = healthScoreDropdownRef.current && healthScoreDropdownRef.current.contains(target)
      const isClickInMediaDropdown = mediaDropdownRef.current && mediaDropdownRef.current.contains(target)
      const isClickInStageInMoreDropdown = stageInMoreDropdownRef.current && stageInMoreDropdownRef.current.contains(target)
      
      if (!isClickInPlanDropdown) setShowPlanDropdown(false)
      if (!isClickInSubTypeDropdown) setShowSubTypeDropdown(false)
      if (!isClickInRegionDropdown) setShowRegionDropdown(false)
      if (!isClickInHealthScoreDropdown) setShowHealthScoreDropdown(false)
      if (!isClickInMediaDropdown) setShowMediaDropdown(false)
      if (!isClickInStageInMoreDropdown) setShowStageInMoreDropdown(false)
    }

    if (showPlanDropdown || showSubTypeDropdown || showRegionDropdown || showHealthScoreDropdown || showMediaDropdown || showStageInMoreDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreFilters, showPlanDropdown, showSubTypeDropdown, showRegionDropdown, showHealthScoreDropdown, showMediaDropdown, showStageInMoreDropdown])

  return (
    <>
    <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-3">
      {/* Left side - Search bar only */}
      <div className="flex items-center pt-0">
        {/* Search Bar */}
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full sm:w-[214px] h-8 pl-10 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
              <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

        {/* Right side - Main filters (Stage, Product, Type), More Filters button, and account toggle */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">

        {/* Type Filter */}
        <div ref={typeDropdownRef} className="relative flex-shrink-0">
          <button
            onClick={() => {
              setShowTypeDropdown(!showTypeDropdown)
                setShowProductDropdown(false)
                setShowStageDropdown(false)
            }}
            className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
                    >
                      <span className="flex items-center gap-2">
                        <span className={selectedTypes.length === 0 ? "text-gray-500" : "text-gray-900"}>Dealer Type</span>
                        {selectedTypes.length > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {selectedTypes.length}
                          </span>
                        )}
                      </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {showTypeDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-48 overflow-y-auto min-w-[180px]">
                        {typeOptions.filter(o => o.value !== "All").map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleTypeToggle(option.value)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedTypes.includes(option.value)}
                              onChange={() => {}}
                              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

        {/* Rooftop Type Filter */}
        <div ref={rooftopTypeDropdownRef} className="relative flex-shrink-0">
          <button
            onClick={() => {
              setShowRooftopTypeDropdown(!showRooftopTypeDropdown)
              setShowTypeDropdown(false)
              setShowProductDropdown(false)
              setShowStageDropdown(false)
            }}
            className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
          >
            <span className="flex items-center gap-2">
              <span className={selectedRooftopTypes.length === 0 ? "text-gray-500" : "text-gray-900"}>Rooftop Type</span>
              {selectedRooftopTypes.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {selectedRooftopTypes.length}
                </span>
              )}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showRooftopTypeDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[160px]">
              {[{ label: "Franchise", value: "franchise" }, { label: "Independent", value: "independent" }].map((option) => (
                <div
                  key={option.value}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleRooftopTypeToggle(option.value)}
                >
                  <input
                    type="checkbox"
                    checked={selectedRooftopTypes.includes(option.value)}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dealer Segment Filter */}
        <div ref={dealerSegmentDropdownRef} className="relative flex-shrink-0">
          <button
            onClick={() => {
              setShowDealerSegmentDropdown(!showDealerSegmentDropdown)
              setShowTypeDropdown(false)
              setShowRooftopTypeDropdown(false)
              setShowProductDropdown(false)
              setShowStageDropdown(false)
            }}
            className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[140px]"
          >
            <span className="flex items-center gap-2">
              <span className={selectedDealerSegments.length === 0 ? "text-gray-500" : "text-gray-900"}>Dealer Segment</span>
              {selectedDealerSegments.length > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {selectedDealerSegments.length}
                </span>
              )}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
              <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {showDealerSegmentDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[160px]">
              {["Enterprise", "Mid Market", "SMB", "Reseller"].map((segment) => (
                <div
                  key={segment}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleDealerSegmentToggle(segment)}
                >
                  <input
                    type="checkbox"
                    checked={selectedDealerSegments.includes(segment)}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{segment}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Filter */}
        <div ref={productDropdownRef} className="relative flex-shrink-0 hidden">
                    <button
            onClick={() => {
              setShowProductDropdown(!showProductDropdown)
              setShowTypeDropdown(false)
              setShowStageDropdown(false)
            }}
            className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
                    >
                      <span className="flex items-center gap-2">
                        <span className={selectedProducts.length === 0 ? "text-gray-500" : "text-gray-900"}>Product</span>
                        {selectedProducts.length > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {selectedProducts.length}
                          </span>
                        )}
                      </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {showProductDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto min-w-[150px]">
                        {productOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleProductToggle(option.value)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedProducts.includes(option.value)}
                              onChange={() => {}}
                              className="mr-3 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

        {/* Stage Filter */}
        <div ref={stageDropdownRef} className="relative flex-shrink-0">
                    <button
            onClick={() => {
              setShowStageDropdown(!showStageDropdown)
              setShowTypeDropdown(false)
              setShowProductDropdown(false)
            }}
            className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
                    >
                      <span className="flex items-center gap-2">
                        <span className={selectedStages.length === 0 ? "text-gray-500" : "text-gray-900"}>Stage</span>
                        {selectedStages.length > 0 && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {selectedStages.length}
                          </span>
                        )}
                      </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    {showStageDropdown && (
            <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto min-w-[180px]">
                        {stageOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleStageToggle(option.value)}
                          >
                            <input
                              type="checkbox"
                              checked={selectedStages.includes(option.value)}
                              onChange={() => {}}
                              className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

          {/* Media Filter — Studio AI tab only */}
          {activeTab === "studio_ai" && (
            <div ref={mediaTabDropdownRef} className="relative flex-shrink-0">
              <button
                onClick={() => {
                  setShowMediaTabDropdown(!showMediaTabDropdown)
                  setShowTypeDropdown(false)
                  setShowStageDropdown(false)
                  setShowRooftopTypeDropdown(false)
                }}
                className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
              >
                <span className="flex items-center gap-2">
                  <span className={selectedMediaTab.length === 0 ? "text-gray-500" : "text-gray-900"}>Media</span>
                  {selectedMediaTab.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                      {selectedMediaTab.length}
                    </span>
                  )}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showMediaTabDropdown && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[160px]">
                  {["Images", "360 Spin", "Video Tour"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleMediaTabToggle(option)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMediaTab.includes(option)}
                        onChange={() => {}}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agents Filter — Vini AI tab only */}
          {activeTab === "vini_ai" && (
            <div ref={agentDropdownRef} className="relative flex-shrink-0">
              <button
                onClick={() => {
                  setShowAgentDropdown(!showAgentDropdown)
                  setShowTypeDropdown(false)
                  setShowStageDropdown(false)
                  setShowRooftopTypeDropdown(false)
                }}
                className="h-8 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[100px] sm:min-w-[120px]"
              >
                <span className="flex items-center gap-2">
                  <span className={selectedAgents.length === 0 ? "text-gray-500" : "text-gray-900"}>Agents</span>
                  {selectedAgents.length > 0 && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                      {selectedAgents.length}
                    </span>
                  )}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 ml-2">
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {showAgentDropdown && (
                <div className="absolute top-full mt-1 left-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] min-w-[160px]">
                  {["Service IB", "Service OB", "Sales IB", "Sales OB"].map((option) => (
                    <div
                      key={option}
                      className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAgentToggle(option)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAgents.includes(option)}
                        onChange={() => {}}
                        className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* At Risk Quick Filter */}
          <button
            onClick={() => onAtRiskChange?.(!atRiskActive)}
            className={`h-8 px-3 border rounded-lg text-sm flex items-center gap-1.5 flex-shrink-0 font-medium transition-colors ${
              atRiskActive
                ? 'border-red-400 bg-red-50 text-red-600'
                : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${atRiskActive ? 'bg-red-500' : 'bg-red-400'}`} />
            At Risk
          </button>

          {/* More Filters Button */}
          <div className="relative flex-shrink-0 hidden" ref={moreFiltersRef}>
            <button
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className={`h-8 px-3 border border-gray-300 rounded-lg text-sm bg-white hover:bg-gray-50 flex items-center gap-2 ${
                hasActiveMoreFilters ? 'border-blue-600' : ''
              }`}
            >
              <span className={`whitespace-nowrap ${hasActiveMoreFilters ? 'text-gray-900' : 'text-gray-500'}`}>More Filters</span>
              {activeMoreFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium text-white bg-blue-600 rounded-full">
                  {activeMoreFiltersCount}
                </span>
              )}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {/* More Filters Dropdown Modal */}
            {showMoreFilters && (
              <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-[500px] lg:w-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[9999] max-h-[600px] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                </div>

                {/* Filters Content - 2 Column Grid */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
                    {/* Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <div ref={planDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowPlanDropdown(!showPlanDropdown)
                            setShowSubTypeDropdown(false)
                            setShowRegionDropdown(false)
                            setShowHealthScoreDropdown(false)
                            setShowMediaDropdown(false)
                            setShowStageInMoreDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className={selectedPlan === "All" ? "text-gray-500" : "text-gray-900"}>
                            {selectedPlan === "All" ? "All" : selectedPlan}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showPlanDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-48 overflow-y-auto">
                            {["All", "Essential", "Growth", "Comprehensive"].map((option) => (
                              <button
                                key={option}
                                onClick={() => handlePlanSelect(option)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                  selectedPlan === option ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sub Type Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sub Type</label>
                      <div ref={subTypeDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowSubTypeDropdown(!showSubTypeDropdown)
                            setShowPlanDropdown(false)
                            setShowRegionDropdown(false)
                            setShowHealthScoreDropdown(false)
                            setShowMediaDropdown(false)
                            setShowStageInMoreDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className={selectedSubTypes.length === 0 ? "text-gray-500" : "text-gray-900"}>
                            {selectedSubTypes.length === 0 ? "Select sub types" : `${selectedSubTypes.length} selected`}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showSubTypeDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-60 overflow-y-auto">
                            {subTypeOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleSubTypeToggle(option.value)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedSubTypes.includes(option.value)}
                                  onChange={() => {}}
                                  className="mr-3 h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Media Filter (Product filter for More Filters panel) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Media</label>
                      <div ref={mediaDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowMediaDropdown(!showMediaDropdown)
                            setShowPlanDropdown(false)
                            setShowSubTypeDropdown(false)
                            setShowRegionDropdown(false)
                            setShowHealthScoreDropdown(false)
                            setShowStageInMoreDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-gray-500">Select media</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showMediaDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-60 overflow-y-auto">
                            <div className="px-3 py-2 text-sm text-gray-500">Media options coming soon...</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Filter (in More Filters) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Stage</label>
                      <div ref={stageInMoreDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowStageInMoreDropdown(!showStageInMoreDropdown)
                            setShowPlanDropdown(false)
                            setShowSubTypeDropdown(false)
                            setShowRegionDropdown(false)
                            setShowHealthScoreDropdown(false)
                            setShowMediaDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-gray-500">Select stages</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showStageInMoreDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-60 overflow-y-auto">
                            <div className="px-3 py-2 text-sm text-gray-500">Stage options coming soon...</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Region Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                      <div ref={regionDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowRegionDropdown(!showRegionDropdown)
                            setShowPlanDropdown(false)
                            setShowSubTypeDropdown(false)
                            setShowHealthScoreDropdown(false)
                            setShowMediaDropdown(false)
                            setShowStageInMoreDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className={selectedRegions.length === 0 ? "text-gray-500" : "text-gray-900"}>
                            {selectedRegions.length === 0 ? "Select regions" : `${selectedRegions.length} selected`}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showRegionDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-60 overflow-y-auto">
                            {regionOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleRegionToggle(option.value)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedRegions.includes(option.value)}
                                  onChange={() => {}}
                                  className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

        {/* Plan Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
                      <div className="relative">
                    <button
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className="text-gray-500">All</span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                      </div>
                  </div>

                    {/* Health Score Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Health Score</label>
                      <div ref={healthScoreDropdownRef} className="relative">
                        <button
                          onClick={() => {
                            setShowHealthScoreDropdown(!showHealthScoreDropdown)
                            setShowPlanDropdown(false)
                            setShowSubTypeDropdown(false)
                            setShowRegionDropdown(false)
                            setShowMediaDropdown(false)
                            setShowStageInMoreDropdown(false)
                          }}
                          className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                        >
                          <span className={selectedHealthScoreRanges.length === 0 ? "text-gray-500" : "text-gray-900"}>
                            {selectedHealthScoreRanges.length === 0 ? "Select ranges" : `${selectedHealthScoreRanges.length} selected`}
                          </span>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        
                        {showHealthScoreDropdown && (
                          <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-[10000] max-h-60 overflow-y-auto">
                            {healthScoreRangeOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                onClick={() => handleHealthScoreRangeToggle(option.value)}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedHealthScoreRanges.includes(option.value)}
                                  onChange={() => {}}
                                  className={`mr-3 h-4 w-4 border-gray-300 rounded focus:ring-2 ${
                                    option.value === '0-3' ? 'text-red-600 focus:ring-red-500' :
                                    option.value === '4-6' ? 'text-yellow-600 focus:ring-yellow-500' :
                                    option.value === '7-8' ? 'text-blue-600 focus:ring-blue-500' :
                                    'text-green-600 focus:ring-green-500'
                                  }`}
                                />
                                <span className={`text-sm ${
                                  option.value === '0-3' ? 'text-red-700' :
                                  option.value === '4-6' ? 'text-yellow-700' :
                                  option.value === '7-8' ? 'text-blue-700' :
                                  'text-green-700'
                                }`}>{option.label}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button - Only visible when filters are active */}
          {hasAnyActiveFilters && (
            <button
              onClick={handleResetAllFilters}
              className="h-8 px-4 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 flex items-center transition-colors duration-200 flex-shrink-0 whitespace-nowrap"
            >
              Reset
            </button>
          )}

          {/* Views Button with Dropdown */}
          <div ref={viewsDropdownRef} className="relative flex-shrink-0 hidden">
            <button
              onClick={() => setShowViewsDropdown(!showViewsDropdown)}
              className={`h-8 px-3 border rounded-lg text-sm flex items-center gap-2 transition-colors duration-200 flex-shrink-0 ${
                activeView 
                  ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' 
                  : 'border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={activeView ? "text-blue-600" : "text-gray-600"}>
                <mask id="mask0_168_3566" style={{maskType:'alpha'}} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                  <rect width="20" height="20" fill="#D9D9D9"/>
                </mask>
                <g mask="url(#mask0_168_3566)">
                  <path d="M6.5 18C6.04167 18 5.67708 17.8646 5.40625 17.5938C5.13542 17.3229 5 16.9583 5 16.5V6.5C5 6.04167 5.13542 5.67708 5.40625 5.40625C5.67708 5.13542 6.04167 5 6.5 5H16.5C16.9583 5 17.3229 5.13542 17.5938 5.40625C17.8646 5.67708 18 6.04167 18 6.5V16.5C18 16.9583 17.8646 17.3229 17.5938 17.5938C17.3229 17.8646 16.9583 18 16.5 18H6.5ZM6.5 16.5H10.75V13.75H6.5V16.5ZM12.25 16.5H16.5V13.75H12.25V16.5ZM2.75438 15C2.54313 15 2.36458 14.9281 2.21875 14.7844C2.07292 14.6406 2 14.4625 2 14.25V3.495C2 3.04 2.13542 2.67708 2.40625 2.40625C2.67708 2.13542 3.04 2 3.495 2H14.25C14.4625 2 14.6406 2.07146 14.7844 2.21437C14.9281 2.35729 15 2.53437 15 2.74562C15 2.95687 14.9281 3.13542 14.7844 3.28125C14.6406 3.42708 14.4625 3.5 14.25 3.5H3.5V14.25C3.5 14.4625 3.42854 14.6406 3.28563 14.7844C3.14271 14.9281 2.96563 15 2.75438 15ZM6.5 12.25H10.75V9.5H6.5V12.25ZM12.25 12.25H16.5V9.5H12.25V12.25ZM6.5 8H16.5V6.5H6.5V8Z" fill="currentColor"/>
                </g>
              </svg>
              <span className={`font-medium whitespace-nowrap ${activeView ? 'text-blue-700' : 'text-gray-700'}`}>
                {activeView ? activeView.name : 'Views'}
              </span>
              {activeView && (
                <button
                  onClick={handleClearView}
                  className="ml-1 p-0.5 text-blue-600 hover:text-blue-800 hover:bg-blue-200 rounded transition-colors"
                  title="Clear view"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3.5 3.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
            </button>

            {/* Views Dropdown */}
            {showViewsDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden">
                {/* Saved Views List */}
                <div className="max-h-60 overflow-y-auto">
                  {savedViews.map((view) => (
                    <div
                      key={view.id}
                      className={`flex items-center justify-between px-4 py-2.5 group ${
                        activeView?.id === view.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <button
                        onClick={() => handleSelectView(view)}
                        className={`flex-1 text-left text-sm flex items-center gap-2 ${
                          activeView?.id === view.id ? 'text-blue-700 font-medium' : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {activeView?.id === view.id && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-blue-600 flex-shrink-0">
                            <path d="M13.5 4L6 11.5L2.5 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        <span>{view.name}</span>
                      </button>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditView(view)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit view"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.333 2A1.886 1.886 0 0 1 14 4.667l-9 9-3.667 1 1-3.667 9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteView(view.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete view"
                        >
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200"></div>

                {/* Create New View Button */}
                <button
                  onClick={handleCreateNewView}
                  className="w-full px-4 py-2.5 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Create new view
                </button>
              </div>
            )}
          </div>

          {/* Period Filter */}
          <div className="relative flex items-center flex-shrink-0" ref={customDateRef}>
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 h-8">
              {(['mtd', 'qtd', 'custom'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    if (p === 'custom') {
                      setShowCustomDatePicker(prev => !prev)
                      onPeriodChange?.({ type: 'custom', startDate: customStart, endDate: customEnd })
                    } else {
                      setShowCustomDatePicker(false)
                      onPeriodChange?.({ type: p })
                    }
                  }}
                  className={`px-2 sm:px-3 h-7 flex items-center text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
                    periodValue.type === p
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {p === 'custom' && periodValue.type === 'custom' && periodValue.startDate && periodValue.endDate
                    ? `${fmtDate(periodValue.startDate)} – ${fmtDate(periodValue.endDate)}`
                    : p === 'custom' ? 'Custom' : p.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Clear button when custom range is active */}
            {periodValue.type === 'custom' && periodValue.startDate && periodValue.endDate && (
              <button
                onClick={() => {
                  setCustomStart("")
                  setCustomEnd("")
                  setShowCustomDatePicker(false)
                  onPeriodChange?.({ type: 'mtd' })
                }}
                className="ml-1 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
                title="Clear custom range"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8m0-8L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}

            {/* Custom date range picker dropdown */}
            {showCustomDatePicker && (
              <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-[9999] p-4 flex flex-col gap-3 min-w-[260px]">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Range</div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">Start date</label>
                    <input
                      type="date"
                      value={customStart}
                      onChange={e => {
                        setCustomStart(e.target.value)
                        if (!customEnd) {
                          setTimeout(() => {
                            endDateInputRef.current?.focus()
                            endDateInputRef.current?.showPicker?.()
                          }, 0)
                        }
                      }}
                      className="h-8 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-500">End date</label>
                    <input
                      ref={endDateInputRef}
                      type="date"
                      value={customEnd}
                      onChange={e => setCustomEnd(e.target.value)}
                      className="h-8 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    onPeriodChange?.({ type: 'custom', startDate: customStart, endDate: customEnd })
                    setShowCustomDatePicker(false)
                  }}
                  className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create View Modal */}
      {showCreateViewModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditingView ? 'Edit View' : 'Create New View'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateViewModal(false)
                  setIsEditingView(false)
                  setEditingViewId(null)
                }}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {/* View Name Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                  placeholder="Enter view name"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Columns Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Select Columns ({selectedViewColumns.length} selected)
                  </label>
                  <button
                    onClick={() => {
                      const requiredColumns = availableColumns.filter(col => col.required).map(col => col.value)
                      let newSelectedColumns: string[]
                      if (selectedViewColumns.length === availableColumns.length) {
                        // Deselect all except required columns
                        newSelectedColumns = requiredColumns
                      } else {
                        // Select all columns
                        newSelectedColumns = availableColumns.map(col => col.value)
                      }
                      setSelectedViewColumns(newSelectedColumns)
                      reorderColumnsWithCheckedFirst(newSelectedColumns)
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {selectedViewColumns.length === availableColumns.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* Search Bar */}
                <div className="mb-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search columns..."
                      value={columnSearchQuery}
                      onChange={(e) => setColumnSearchQuery(e.target.value)}
                      className="w-full h-9 pl-9 pr-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder-gray-400"
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400">
                        <path d="M7.333 12.667A5.333 5.333 0 1 0 7.333 2a5.333 5.333 0 0 0 0 10.667ZM14 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {columnSearchQuery && (
                      <button
                        onClick={() => setColumnSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M4 4l8 8m0-8l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Columns List */}
                <div className="space-y-2 h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
                  {(() => {
                    const filteredColumns = columnOrder.filter((columnValue) => {
                      const column = availableColumns.find(col => col.value === columnValue)
                      if (!column) return false
                      if (!columnSearchQuery) return true
                      return column.label.toLowerCase().includes(columnSearchQuery.toLowerCase())
                    })
                    
                    if (filteredColumns.length === 0) {
                      return (
                        <div className="text-center py-8 text-gray-500">
                          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mx-auto mb-3 text-gray-300">
                            <path d="M21 36c8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15C12.716 6 6 12.716 6 21c0 8.284 6.716 15 15 15zM42 42l-8.7-8.7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="text-sm font-medium">No columns found</p>
                          <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                        </div>
                      )
                    }
                    
                    return filteredColumns.map((columnValue) => {
                    const column = availableColumns.find(col => col.value === columnValue)
                    if (!column) return null
                    
                    return (
                    <div
                      key={column.value}
                      draggable={!column.required}
                      onDragStart={() => handleDragStart(column.value)}
                      onDragOver={(e) => handleDragOver(e, column.value)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg transition-all ${
                        column.required 
                          ? 'opacity-60 cursor-not-allowed bg-gray-50' 
                          : draggedColumn === column.value
                            ? 'bg-blue-100 border-2 border-blue-400 opacity-50'
                            : 'bg-gray-50 hover:bg-gray-100 cursor-move'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {!column.required && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-400 flex-shrink-0">
                            <path d="M5 3h6M5 8h6M5 13h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        )}
                        <input
                          type="checkbox"
                          checked={selectedViewColumns.includes(column.value)}
                          onChange={() => handleColumnToggle(column.value)}
                          disabled={column.required}
                          className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0 ${
                            column.required ? 'cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        />
                        <span className={`text-sm font-medium whitespace-nowrap ${
                          column.required ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                          {column.label}
                          {column.required && (
                            <span className="ml-1.5 text-xs text-gray-400">(Required)</span>
                          )}
                        </span>
                      </div>

                      {/* Filter Dropdown - Show only for columns with filters */}
                      {column.hasFilter && (
                        <div className="relative flex-shrink-0">
                          <button
                            onClick={() => setOpenColumnFilterDropdown(openColumnFilterDropdown === column.value ? null : column.value)}
                            className={`h-8 px-3 border rounded-lg text-xs text-left bg-white hover:bg-gray-50 flex items-center justify-between min-w-[140px] ${
                              viewColumnFilters[column.value] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                            }`}
                          >
                            <span className={viewColumnFilters[column.value] ? "text-gray-900" : "text-gray-500"}>
                              {column.filterType === 'select' 
                                ? (viewColumnFilters[column.value] || 'Select')
                                : viewColumnFilters[column.value] && Array.isArray(viewColumnFilters[column.value]) && viewColumnFilters[column.value].length > 0
                                  ? `${viewColumnFilters[column.value].length} selected`
                                  : 'Select'
                              }
                            </span>
                            {viewColumnFilters[column.value] ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveColumnFilter(column.value)
                                }}
                                className="ml-2 text-gray-400 hover:text-red-600"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M3.5 3.5l7 7m0-7l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gray-400">
                                <path d="M3.5 5.25l3.5 3.5 3.5-3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </button>

                          {/* Filter Dropdown Menu */}
                          {openColumnFilterDropdown === column.value && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[10001] min-w-[180px] max-h-60 overflow-y-auto">
                              {column.filterType === 'select' ? (
                                // Single Select
                                column.options?.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      handleColumnFilterChange(column.value, option.value)
                                      setOpenColumnFilterDropdown(null)
                                    }}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                      viewColumnFilters[column.value] === option.value ? "bg-blue-50 text-blue-600" : "text-gray-700"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                ))
                              ) : (
                                // Multi Select
                                column.options?.map((option) => (
                                  <div
                                    key={option.value}
                                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={() => {
                                      const currentValues = viewColumnFilters[column.value] || []
                                      const newValues = Array.isArray(currentValues) && currentValues.includes(option.value)
                                        ? currentValues.filter((v: string) => v !== option.value)
                                        : [...(Array.isArray(currentValues) ? currentValues : []), option.value]
                                      handleColumnFilterChange(column.value, newValues.length > 0 ? newValues : undefined)
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Array.isArray(viewColumnFilters[column.value]) && viewColumnFilters[column.value].includes(option.value)}
                                      onChange={() => {}}
                                      className="mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    )
                  })
                  })()}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  setShowCreateViewModal(false)
                  setIsEditingView(false)
                  setEditingViewId(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveView}
                disabled={!newViewName.trim() || selectedViewColumns.length === 0}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isEditingView ? 'Update View' : 'Save View'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
