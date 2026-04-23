// API Service for Dashboard Data (dummy data only)

// API Response Types
export interface RevenueTableApiResponse {
  message: string
  error: boolean
  code: string
  details: null
  data: {
    healthScore: {
      overallHealthScore: string
      lastMonthHealthScore: {
        value: string
        more: boolean
      }
      redAccountRevenue: number
      redAccountEnterpriseCount: number
      amberAccountRevenue: number
      amberAccountEnterpriseCount: number
      greenAccountRevenue: number
      greenAccountEnterpriseCount: number
    }
    retention: {
      grr: {
        percentage: number
        lastMonthPercentage: number
        more: boolean
      }
      nrr: {
        percentage: number
        lastMonthPercentage: number
        more: boolean
      }
    }
    contractLive: {
      ContractLiveRevenue: number
      ContractLiveEnterpriseCount: number
      ContractLiveRevenueMtd: number
      ContractLiveEnterpriseCountMtd: number
    }
    actualLive: {
      ActualLiveRevenue: number
      ActualLiveEnterpriseCount: number
      ActualLiveRevenueMtd: number
      ActualLiveEnterpriseCountMtd: number
    }
    churn: {
      ThisMonthChurnRevenue: number
      ThisMonthChurnEnterpriseCount: number
      Last12MonthsChurnRevenue: number
      Last12MonthsChurnEnterpriseCount: number
      FutureChurnRevenue: number
      FutureChurnEnterpriseCount: number
    }
  }
}

interface ApiRequestOptions {
  filters?: Record<string, any>
}

const DUMMY_ENTERPRISES = [
  {
    organisation_id: "org-1001",
    name: "Price LeBlanc Automotive",
    plan: "Platinum",
    health_score: 8.4,
    account_size: "XL",
    live_arr: 1200000,
    contracted_arr: 1400000,
    stage: "Live",
    region: "AMER",
    rooftops: 42,
    usage_percentage: 78,
    last_activity: "2026-04-20",
    contract_renewal_date: "2026-12-31",
    nps_score: 9,
    used_quantity: 6302,
    total_quantity: 12000,
    high_severity_tickets: 1,
    medium_severity_tickets: 2,
    low_severity_tickets: 4,
    products: [
      { product_name: "Studio AI", stage: "Live" },
      { product_name: "Converse AI", stage: "Live" },
      { product_name: "Videos", stage: "Live" },
    ],
    enterprises: [{ enterprise_id: "ent-1001", subscription_volume_unit: "VINs" }],
    poc_ae: "{\"name\":\"Saurabh\",\"email\":\"saurabh@example.com\"}",
    poc_cs: "{\"name\":\"Jay\",\"email\":\"jay@example.com\"}",
    poc_ob: "{\"name\":\"Ashley Riccio\",\"email\":\"ashley@example.com\"}",
  },
  {
    organisation_id: "org-1002",
    name: "AutoMax Group",
    plan: "Gold",
    health_score: 6.2,
    account_size: "L",
    live_arr: 720000,
    contracted_arr: 900000,
    stage: "Onboarding",
    region: "APAC",
    rooftops: 26,
    usage_percentage: 64,
    last_activity: "2026-04-18",
    contract_renewal_date: "2026-10-15",
    nps_score: 8,
    used_quantity: 4200,
    total_quantity: 9000,
    high_severity_tickets: 2,
    medium_severity_tickets: 3,
    low_severity_tickets: 8,
    products: [
      { product_name: "Studio AI", stage: "Live" },
      { product_name: "360", stage: "Contracted" },
    ],
    enterprises: [{ enterprise_id: "ent-1002", subscription_volume_unit: "VINs" }],
  },
  {
    organisation_id: "org-1003",
    name: "CarVista Holdings",
    plan: "Enterprise",
    health_score: 9.1,
    account_size: "XL",
    live_arr: 2100000,
    contracted_arr: 2350000,
    stage: "Live",
    region: "EMEA",
    rooftops: 60,
    usage_percentage: 84,
    last_activity: "2026-04-22",
    contract_renewal_date: "2027-02-01",
    nps_score: 9.3,
    used_quantity: 11200,
    total_quantity: 15000,
    high_severity_tickets: 0,
    medium_severity_tickets: 1,
    low_severity_tickets: 3,
    products: [
      { product_name: "Images", stage: "Live" },
      { product_name: "Videos", stage: "Live" },
      { product_name: "Converse AI", stage: "Live" },
    ],
    enterprises: [{ enterprise_id: "ent-1003", subscription_volume_unit: "VINs" }],
  },
]

const DUMMY_ROOFTOPS = [
  {
    enterpriseId: "ent-1001",
    teamId: "team-2101",
    teamName: "Price LeBlanc Downtown",
    enterpriseName: "Price LeBlanc Automotive",
    stage: "Live",
    accountType: "GROUP_DEALER",
    accountSubType: "Independent Dealer",
    healthScore: 8,
    plan: "Platinum",
    products: { image: "Live", video: "Live", threeSixty: "Live", converseAI: "Live" },
    region: "AMER",
    contractedDate: "2025-01-15",
    contractStartDate: "2025-01-20",
    liveDate: "2025-02-10",
    contractEndDate: "2026-12-31",
    contractDuration: 24,
    paymentFrequency: "Monthly",
    lockInPeriod: 12,
    contractedArr: 180000,
    liveArr: 170000,
    vinsProcessedThisMonth: 1240,
    vinsProcessedLastMonth: 1188,
    vinsProcessedLast3MonthsAverage: 1210,
    totalTickets: 26,
    openTickets: 2,
    closedTickets: 24,
    ae: "Saurabh",
    ob: "Ashley Riccio",
    cs: "Jay",
    isTestAccount: false,
  },
  {
    enterpriseId: "ent-1001",
    teamId: "team-2102",
    teamName: "Price LeBlanc East",
    enterpriseName: "Price LeBlanc Automotive",
    stage: "Contracted",
    accountType: "GROUP_DEALER",
    accountSubType: "Franchise Dealer",
    healthScore: 6,
    plan: "Platinum",
    products: { image: "Live", video: "Contracted", threeSixty: "Live" },
    region: "AMER",
    contractedDate: "2025-03-10",
    contractStartDate: "2025-03-15",
    liveDate: "2025-04-05",
    contractEndDate: "2027-03-10",
    contractDuration: 24,
    paymentFrequency: "Quarterly",
    lockInPeriod: 12,
    contractedArr: 160000,
    liveArr: 120000,
    vinsProcessedThisMonth: 980,
    vinsProcessedLastMonth: 910,
    vinsProcessedLast3MonthsAverage: 942,
    totalTickets: 18,
    openTickets: 4,
    closedTickets: 14,
    ae: "Saurabh",
    ob: "Ashley Riccio",
    cs: "Jay",
    isTestAccount: false,
  },
  {
    enterpriseId: "ent-1002",
    teamId: "team-2201",
    teamName: "AutoMax Tokyo",
    enterpriseName: "AutoMax Group",
    stage: "Onboarding",
    accountType: "INDIVIDUAL_DEALER",
    accountSubType: "Franchise Dealer",
    healthScore: 5,
    plan: "Gold",
    products: { image: "Live", threeSixty: "Contracted" },
    region: "APAC",
    contractedDate: "2025-06-12",
    contractStartDate: "2025-06-15",
    liveDate: "2025-07-20",
    contractEndDate: "2026-06-15",
    contractDuration: 12,
    paymentFrequency: "Monthly",
    lockInPeriod: 6,
    contractedArr: 98000,
    liveArr: 82000,
    vinsProcessedThisMonth: 620,
    vinsProcessedLastMonth: 580,
    vinsProcessedLast3MonthsAverage: 600,
    totalTickets: 12,
    openTickets: 2,
    closedTickets: 10,
    ae: "Saarthak",
    ob: "Saarthak",
    cs: "Ashley Riccio",
    isTestAccount: false,
  },
  {
    enterpriseId: "ent-1003",
    teamId: "team-2301",
    teamName: "CarVista Munich",
    enterpriseName: "CarVista Holdings",
    stage: "Live",
    accountType: "GROUP_DEALER",
    accountSubType: "Independent Dealer",
    healthScore: 9,
    plan: "Enterprise",
    products: { image: "Live", video: "Live", threeSixty: "Live", converseAI: "Live" },
    region: "EMEA",
    contractedDate: "2024-11-10",
    contractStartDate: "2024-11-15",
    liveDate: "2024-12-05",
    contractEndDate: "2027-11-15",
    contractDuration: 36,
    paymentFrequency: "Annually",
    lockInPeriod: 18,
    contractedArr: 260000,
    liveArr: 250000,
    vinsProcessedThisMonth: 1720,
    vinsProcessedLastMonth: 1660,
    vinsProcessedLast3MonthsAverage: 1695,
    totalTickets: 31,
    openTickets: 3,
    closedTickets: 28,
    ae: "Ashley Riccio",
    ob: "Archit",
    cs: "Saurabh",
    isTestAccount: false,
  },
]

const DUMMY_REVENUE_RESPONSE: RevenueTableApiResponse = {
  error: false,
  message: "Success",
  code: "200",
  details: null,
  data: {
    healthScore: {
      overallHealthScore: "7.6",
      lastMonthHealthScore: { value: "7.2", more: true },
      redAccountRevenue: 350000,
      redAccountEnterpriseCount: 12,
      amberAccountRevenue: 980000,
      amberAccountEnterpriseCount: 24,
      greenAccountRevenue: 2730000,
      greenAccountEnterpriseCount: 41,
    },
    retention: {
      grr: { percentage: 92.4, lastMonthPercentage: 91.7, more: true },
      nrr: { percentage: 108.8, lastMonthPercentage: 107.1, more: true },
    },
    contractLive: {
      ContractLiveRevenue: 4060000,
      ContractLiveEnterpriseCount: 77,
      ContractLiveRevenueMtd: 338000,
      ContractLiveEnterpriseCountMtd: 6,
    },
    actualLive: {
      ActualLiveRevenue: 3430000,
      ActualLiveEnterpriseCount: 69,
      ActualLiveRevenueMtd: 301000,
      ActualLiveEnterpriseCountMtd: 5,
    },
    churn: {
      ThisMonthChurnRevenue: 82000,
      ThisMonthChurnEnterpriseCount: 2,
      Last12MonthsChurnRevenue: 920000,
      Last12MonthsChurnEnterpriseCount: 19,
      FutureChurnRevenue: 145000,
      FutureChurnEnterpriseCount: 3,
    },
  },
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function applyEnterpriseFilters(data: any[], options: any) {
  const filters = options?.filters || {}
  const search = typeof filters.search === "string" ? filters.search.toLowerCase() : ""

  if (!search) return data
  return data.filter((item) => item.name.toLowerCase().includes(search))
}

function applyRooftopFilters(
  items: typeof DUMMY_ROOFTOPS,
  options: {
    search?: string
    plan?: string
    type?: string
    subTypes?: string[]
    products?: string[]
    stages?: string[]
    regions?: string[]
    accountType?: "live" | "test"
    sortBy?: string | null
    sortOrder?: "ASC" | "DESC"
  }
) {
  let filtered = [...items]

  if (options.search) {
    const query = options.search.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.teamName.toLowerCase().includes(query) ||
        item.enterpriseName.toLowerCase().includes(query) ||
        item.enterpriseId.toLowerCase().includes(query)
    )
  }

  if (options.plan && options.plan !== "All") {
    filtered = filtered.filter((item) => item.plan === options.plan)
  }

  if (options.type && options.type !== "All") {
    filtered = filtered.filter((item) => item.accountType === options.type)
  }

  if (options.subTypes && options.subTypes.length > 0) {
    filtered = filtered.filter((item) => options.subTypes?.includes(item.accountSubType))
  }

  if (options.products && options.products.length > 0) {
    filtered = filtered.filter((item) => {
      const productMap: Record<string, string | undefined> = {
        Images: item.products.image,
        Videos: item.products.video,
        "360": item.products.threeSixty,
      }
      return options.products!.some((product) => Boolean(productMap[product]))
    })
  }

  if (options.stages && options.stages.length > 0) {
    filtered = filtered.filter((item) => options.stages?.includes(item.stage))
  }

  if (options.regions && options.regions.length > 0) {
    filtered = filtered.filter((item) => options.regions?.includes(item.region))
  }

  if (options.accountType === "test") {
    filtered = filtered.filter((item) => item.isTestAccount)
  } else {
    filtered = filtered.filter((item) => !item.isTestAccount)
  }

  if (options.sortBy) {
    const key = options.sortBy
    const direction = options.sortOrder === "DESC" ? -1 : 1
    filtered.sort((a: any, b: any) => {
      const av = a[key] ?? ""
      const bv = b[key] ?? ""
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * direction
      return String(av).localeCompare(String(bv)) * direction
    })
  }

  return filtered
}

export async function fetchEnterpriseTableData(
  options: any = {}
): Promise<any> {
  await sleep(150)
  const pageNo = Number(options.pageNo || 1)
  const batchSize = Number(options.batchSize || 25)
  const filtered = applyEnterpriseFilters(DUMMY_ENTERPRISES, options)
  const start = (pageNo - 1) * batchSize
  const paged = filtered.slice(start, start + batchSize)
  return {
    error: false,
    message: "Success",
    data: {
      data: paged,
    },
    pagination: {
      pageNo,
      batchSize,
      total: filtered.length,
      hasMore: start + batchSize < filtered.length,
    },
  }
}

// Enterprise Table API Response Types
export interface EnterpriseTableApiResponse {
  error: boolean
  message: string
  data: any
}

export async function fetchRevenueTableData(
  options: ApiRequestOptions = {}
): Promise<EnterpriseTableApiResponse> {
  const enterpriseResponse = await fetchEnterpriseTableData({
    filters: options.filters,
    batchSize: 10,
    pageNo: 1,
  })
  return {
    error: false,
    message: "Success",
    data: enterpriseResponse.data,
  }
}

export async function fetchPerformanceOverviewData(
  options: ApiRequestOptions = {}
): Promise<RevenueTableApiResponse> {
  await sleep(120)
  return {
    ...DUMMY_REVENUE_RESPONSE,
    data: {
      ...DUMMY_REVENUE_RESPONSE.data,
      retention: {
        ...DUMMY_REVENUE_RESPONSE.data.retention,
        grr: {
          ...DUMMY_REVENUE_RESPONSE.data.retention.grr,
          percentage:
            DUMMY_REVENUE_RESPONSE.data.retention.grr.percentage -
            (options.filters ? 0.3 : 0),
        },
      },
    },
  }
}

// Utility function to format currency with 3 significant digits
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    const millions = amount / 1000000
    // Format to show 3 significant digits
    if (millions >= 100) {
      return `$ ${millions.toFixed(0)}M`
    } else if (millions >= 10) {
      return `$ ${millions.toFixed(1)}M`
    } else {
      return `$ ${millions.toFixed(2)}M`
    }
  } else if (amount >= 1000) {
    const thousands = amount / 1000
    // Format to show 3 significant digits
    if (thousands >= 100) {
      return `$ ${thousands.toFixed(0)}K`
    } else if (thousands >= 10) {
      return `$ ${thousands.toFixed(1)}K`
    } else {
      return `$ ${thousands.toFixed(2)}K`
    }
  } else {
    return `$ ${amount.toFixed(0)}`
  }
}

// Rooftops API Response Types
export interface RooftopsApiResponse {
  error: boolean
  message: string
  data: any
  pagination?: {
    page: number
    limit: number
    total: number
  }
}

export async function fetchRooftopsData(
  options: { 
    page?: number; 
    limit?: number; 
    search?: string;
    type?: string;
    plan?: string;
    subTypes?: string[];
    products?: string[];
    stages?: string[];
    regions?: string[];
    liveArrFilters?: { operator: string; amount: number | number[] }[];
    contractedArrFilters?: { operator: string; amount: number | number[] }[];
    healthScoreRanges?: { min: number; max: number }[];
    sortBy?: string | null;
    sortOrder?: 'ASC' | 'DESC';
    accountType?: 'live' | 'test';
    timestamp?: number;
  } = {}
): Promise<RooftopsApiResponse> {
  const { 
    page = 0, 
    limit = 100, 
    search = '', 
    type = '', 
    plan = '', 
    subTypes = [],
    products = [],
    stages = [],
    regions = [],
    liveArrFilters = [],
    contractedArrFilters = [],
    healthScoreRanges = [],
    sortBy = null,
    sortOrder = 'ASC',
    accountType = 'live',
    timestamp
  } = options

  await sleep(140)
  const filtered = applyRooftopFilters(DUMMY_ROOFTOPS, {
    search,
    plan,
    type,
    subTypes,
    products,
    stages,
    regions,
    accountType,
    sortBy,
    sortOrder,
  })
  const start = page * limit
  const items = filtered.slice(start, start + limit)
  const totals = filtered.reduce(
    (acc, item) => {
      acc.live += item.liveArr
      acc.contracted += item.contractedArr
      return acc
    },
    { live: 0, contracted: 0 }
  )
  return {
    error: false,
    message: "Success",
    data: {
      data: {
        data: items,
        totalRooftops: filtered.length,
        totalLiveArr: totals.live,
        totalContractedArr: totals.contracted,
      },
    },
    pagination: {
      page,
      limit,
      total: filtered.length,
    },
  }
}

// Utility function to calculate percentage change
export function calculatePercentageChange(current: number, previous: number): {
  value: string
  direction: 'up' | 'down'
  color: 'green' | 'red' | 'orange'
} {
  if (previous === 0) {
    return { value: '0%', direction: 'up', color: 'green' }
  }

  const percentageChange = ((current - previous) / previous) * 100
  const isPositive = percentageChange >= 0
  
  return {
    value: `${Math.abs(percentageChange).toFixed(1)}%`,
    direction: isPositive ? 'up' : 'down',
    color: isPositive ? 'green' : 'red'
  }
}


