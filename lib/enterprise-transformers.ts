import type { EnterpriseData } from "@/types/dashboard"
import { formatCurrency } from "./api-service"

// Define the API response type locally to avoid circular imports
interface RevenueTableApiResponse {
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

// Generate enterprise data from health score breakdown
function generateEnterpriseDataFromHealthScore(apiData: RevenueTableApiResponse): any[] {
  const { healthScore, contractLive, actualLive } = apiData.data
  
  const enterprises = []
  
  // Red enterprises (poor health)
  for (let i = 0; i < Math.min(healthScore.redAccountEnterpriseCount, 5); i++) {
    enterprises.push(generateEnterpriseEntry('red', i, healthScore.redAccountRevenue / healthScore.redAccountEnterpriseCount))
  }
  
  // Amber enterprises (medium health)
  for (let i = 0; i < Math.min(healthScore.amberAccountEnterpriseCount, 3); i++) {
    enterprises.push(generateEnterpriseEntry('amber', i, healthScore.amberAccountRevenue / healthScore.amberAccountEnterpriseCount))
  }
  
  // Green enterprises (good health)
  for (let i = 0; i < Math.min(healthScore.greenAccountEnterpriseCount, 2); i++) {
    enterprises.push(generateEnterpriseEntry('green', i, healthScore.greenAccountRevenue / healthScore.greenAccountEnterpriseCount))
  }
  
  return enterprises
}

function generateEnterpriseEntry(healthCategory: 'red' | 'amber' | 'green', index: number, avgRevenue: number) {
  const companyNames = {
    red: ['BMW Group Munich', 'Mercedes-Benz Stuttgart', 'Audi Ingolstadt', 'Volkswagen Wolfsburg', 'Porsche Leipzig'],
    amber: ['Tesla Fremont', 'Ford Dearborn', 'GM Detroit'],
    green: ['Toyota Tokyo', 'Honda Osaka']
  }
  
  const logos = {
    red: ['/bmw-logo.png', '/mercedes-benz-logo.png', '/automotive-company-logo.png', '/placeholder-logo.png', '/automotive-company-logo.png'],
    amber: ['/tesla-logo.png', '/automotive-company-logo.png', '/placeholder-logo.png'],
    green: ['/automotive-company-logo.png', '/placeholder-logo.png']
  }
  
  const statuses = {
    red: ['Churned', 'Live', 'Onboarding'],
    amber: ['Live', 'Onboarding'],
    green: ['Live']
  }
  
  const plans = {
    red: ['Essential', 'Bronze', 'Silver'],
    amber: ['Silver', 'Professional', 'Gold'],
    green: ['Gold', 'Platinum', 'Enterprise']
  }
  
  const regions = ['AMER', 'EMEA', 'APAC']
  const sizes = ['S', 'M', 'L', 'XL', 'XXL']
  const types = ['Dealership', 'OEM', 'Fleet']
  
  const status = statuses[healthCategory][Math.floor(Math.random() * statuses[healthCategory].length)]
  const revenue = avgRevenue * (0.5 + Math.random() * 1.5)
  
  return {
    id: `API-${healthCategory}-${index}-${Date.now()}`,
    enterprise: {
      name: companyNames[healthCategory][index % companyNames[healthCategory].length],
      logo: logos[healthCategory][index % logos[healthCategory].length],
      id: `ent-${healthCategory}-${index}`
    },
    plan: plans[healthCategory][Math.floor(Math.random() * plans[healthCategory].length)],
    usage: healthCategory === 'green' ? 45 + Math.random() * 30 : 
           healthCategory === 'amber' ? 70 + Math.random() * 25 : 
           Math.random() * 40,
    type: types[Math.floor(Math.random() * types.length)],
    liveArr: revenue,
    rooftops: Math.floor(10 + Math.random() * 200),
    lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    renewal: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: status,
    region: regions[Math.floor(Math.random() * regions.length)],
    size: sizes[Math.floor(Math.random() * sizes.length)],
    products: [
      { name: "Studio AI", status: status === 'Live' ? 'Live' : 'Contracted' },
      { name: "Converse AI", status: status === 'Live' ? 'Live' : 'Contracted' }
    ],
    media: [
      { type: "Images", status: status === 'Live' ? 'Live' : 'Contracted' },
      { type: "360 Spins", status: status === 'Live' ? 'Live' : 'Contracted' }
    ],
    credits: {
      totalUsed: Math.floor(1000 + Math.random() * 20000),
      contracted: Math.floor(5000 + Math.random() * 45000),
      unit: "VINs"
    },
    mediaUsage: [
      { type: "Images", count: Math.floor(500 + Math.random() * 5000) },
      { type: "360 Spins", count: Math.floor(100 + Math.random() * 1000) }
    ],
    customerExperience: {
      averageNps: healthCategory === 'green' ? 8 + Math.random() * 2 :
                  healthCategory === 'amber' ? 6 + Math.random() * 2 :
                  2 + Math.random() * 4,
      tickets: {
        open: Math.floor(Math.random() * 5),
        closed: Math.floor(5 + Math.random() * 50)
      }
    }
  }
}

// Transform API data to EnterpriseData format
export function transformApiDataToEnterprises(apiData: RevenueTableApiResponse): EnterpriseData[] {
  const generatedData = generateEnterpriseDataFromHealthScore(apiData)
  
  return generatedData.map((enterprise, index) => {
    const transformedEnterprise: EnterpriseData = {
      id: enterprise.id,
      enterprise: {
        name: enterprise.enterprise.name,
        logo: enterprise.enterprise.logo,
        id: enterprise.enterprise.id
      },
      plan: enterprise.plan as "Essential" | "Professional" | "Enterprise" | "Gold" | "Silver" | "Platinum" | "Bronze",
      usage: enterprise.usage,
      type: enterprise.type as "Dealership" | "OEM" | "Fleet",
      liveArr: enterprise.liveArr,
      rooftops: enterprise.rooftops,
      lastActivity: formatDate(enterprise.lastActivity),
      renewal: formatDate(enterprise.renewal),
      status: enterprise.status as "Live" | "Onboarding" | "Contracted",
      region: enterprise.region,
      size: enterprise.size,
      products: enterprise.products.map((product: any) => ({
        name: product.name,
        status: product.status as "Live" | "Contracted"
      })),
      media: enterprise.media.map((mediaItem: any) => ({
        type: mediaItem.type,
        status: mediaItem.status as "Live" | "Contracted",
        count: mediaItem.count
      })),
      credits: enterprise.credits,
      mediaUsage: enterprise.mediaUsage,
      customerExperience: enterprise.customerExperience
    }
    
    return transformedEnterprise
  })
}

// Helper function to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// Generate detailed enterprise information from health score data
export function createEnterpriseFromHealthScore(
  healthCategory: 'red' | 'amber' | 'green',
  index: number,
  revenueData: any
): EnterpriseData {
  const companyData = getCompanyDataByHealth(healthCategory, index)
  const avgRevenue = calculateAverageRevenue(healthCategory, revenueData)
  
  return {
    id: `${healthCategory}-enterprise-${index}`,
    enterprise: {
      name: companyData.name,
      logo: companyData.logo,
      id: `ent-${healthCategory}-${index}`
    },
    plan: companyData.plan,
    usage: calculateUsagePercentage(healthCategory),
    type: companyData.type,
    liveArr: avgRevenue,
    rooftops: companyData.rooftops,
    lastActivity: generateRandomDate(-30),
    renewal: generateRandomDate(365),
    status: companyData.status,
    region: companyData.region,
    size: companyData.size,
    products: [
      { name: "Studio AI", status: companyData.status === "Live" ? "Live" : "Contracted" },
      { name: "Converse AI", status: companyData.status === "Live" ? "Live" : "Contracted" }
    ],
    media: [
      { type: "Images", status: companyData.status === "Live" ? "Live" : "Contracted" },
      { type: "360 Spins", status: companyData.status === "Live" ? "Live" : "Contracted" }
    ],
    credits: {
      totalUsed: Math.floor(1000 + Math.random() * 20000),
      contracted: Math.floor(5000 + Math.random() * 45000),
      unit: "VINs"
    },
    mediaUsage: [
      { type: "Images", count: Math.floor(500 + Math.random() * 5000) },
      { type: "360 Spins", count: Math.floor(100 + Math.random() * 1000) }
    ],
    customerExperience: {
      averageNps: calculateNpsScore(healthCategory),
      tickets: {
        open: Math.floor(Math.random() * 5),
        closed: Math.floor(5 + Math.random() * 50)
      }
    }
  }
}

function getCompanyDataByHealth(healthCategory: 'red' | 'amber' | 'green', index: number) {
  const companyTemplates = {
    red: [
      { name: "BMW Group Munich", logo: "/bmw-logo.png", plan: "Professional" as const, type: "OEM" as const, status: "Churned" as const, region: "EMEA", size: "XXL", rooftops: 150 },
      { name: "Mercedes-Benz Stuttgart", logo: "/mercedes-benz-logo.png", plan: "Enterprise" as const, type: "OEM" as const, status: "Live" as const, region: "EMEA", size: "XL", rooftops: 120 },
      { name: "Audi Ingolstadt", logo: "/automotive-company-logo.png", plan: "Professional" as const, type: "Dealership" as const, status: "Onboarding" as const, region: "EMEA", size: "L", rooftops: 80 },
      { name: "Volkswagen Wolfsburg", logo: "/placeholder-logo.png", plan: "Essential" as const, type: "Fleet" as const, status: "Live" as const, region: "EMEA", size: "XL", rooftops: 200 },
      { name: "Porsche Leipzig", logo: "/automotive-company-logo.png", plan: "Professional" as const, type: "Dealership" as const, status: "Churned" as const, region: "EMEA", size: "M", rooftops: 45 }
    ],
    amber: [
      { name: "Tesla Fremont", logo: "/tesla-logo.png", plan: "Enterprise" as const, type: "OEM" as const, status: "Live" as const, region: "AMER", size: "XL", rooftops: 90 },
      { name: "Ford Dearborn", logo: "/automotive-company-logo.png", plan: "Professional" as const, type: "OEM" as const, status: "Onboarding" as const, region: "AMER", size: "XXL", rooftops: 180 },
      { name: "GM Detroit", logo: "/placeholder-logo.png", plan: "Enterprise" as const, type: "Fleet" as const, status: "Live" as const, region: "AMER", size: "XL", rooftops: 160 }
    ],
    green: [
      { name: "Toyota Tokyo", logo: "/automotive-company-logo.png", plan: "Enterprise" as const, type: "OEM" as const, status: "Live" as const, region: "APAC", size: "XXL", rooftops: 300 },
      { name: "Honda Osaka", logo: "/placeholder-logo.png", plan: "Enterprise" as const, type: "Dealership" as const, status: "Live" as const, region: "APAC", size: "XL", rooftops: 140 }
    ]
  }
  
  return companyTemplates[healthCategory][index % companyTemplates[healthCategory].length]
}

function calculateAverageRevenue(healthCategory: 'red' | 'amber' | 'green', revenueData: any): number {
  const baseRevenue = {
    red: revenueData?.redAccountRevenue || 300000,
    amber: revenueData?.amberAccountRevenue || 500000,
    green: revenueData?.greenAccountRevenue || 800000
  }
  
  return baseRevenue[healthCategory] * (0.7 + Math.random() * 0.6) // Add variance
}

function calculateUsagePercentage(healthCategory: 'red' | 'amber' | 'green'): number {
  const usageRanges = {
    red: { min: 10, max: 40 },
    amber: { min: 65, max: 85 },
    green: { min: 40, max: 75 }
  }
  
  const range = usageRanges[healthCategory]
  return range.min + Math.random() * (range.max - range.min)
}

function calculateNpsScore(healthCategory: 'red' | 'amber' | 'green'): number {
  const scoreRanges = {
    red: { min: 2, max: 5 },
    amber: { min: 6, max: 8 },
    green: { min: 8, max: 10 }
  }
  
  const range = scoreRanges[healthCategory]
  return range.min + Math.random() * (range.max - range.min)
}

function generateRandomDate(daysOffset: number): string {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset * Math.random())
  return date.toLocaleDateString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}

// Filter enterprises based on health score and status
export function filterEnterprisesByHealth(
  enterprises: EnterpriseData[],
  healthScore: number
): EnterpriseData[] {
  // Filter logic based on health score
  if (healthScore < 4) {
    return enterprises.filter(e => e.status === 'Churned' || e.customerExperience.averageNps < 5)
  } else if (healthScore < 7) {
    return enterprises.filter(e => e.status === 'Onboarding' || (e.customerExperience.averageNps >= 5 && e.customerExperience.averageNps < 8))
  } else {
    return enterprises.filter(e => e.status === 'Live' && e.customerExperience.averageNps >= 8)
  }
}

// Calculate enterprise metrics from list
export function calculateMetricsFromEnterprises(enterprises: EnterpriseData[]) {
  const totalRevenue = enterprises.reduce((sum, e) => sum + e.liveArr, 0)
  const totalRooftops = enterprises.reduce((sum, e) => sum + e.rooftops, 0)
  const liveCount = enterprises.filter(e => e.status === 'Live').length
  const churnedCount = enterprises.filter(e => e.status === 'Churned').length
  
  return {
    totalRevenue: formatCurrency(totalRevenue),
    totalRooftops,
    liveCount,
    churnedCount,
    totalEnterprises: enterprises.length
  }
}
