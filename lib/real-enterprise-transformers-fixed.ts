import type { EnterpriseData } from "@/types/dashboard"

// Transform real API enterprise data to UI format
export function transformRealEnterpriseData(apiResponse: any): EnterpriseData[] {
  try {
    // Handle different possible API response structures
    let organizations: any[] = []
    
    // Try different possible paths for the data
    if (apiResponse?.data?.data?.data && Array.isArray(apiResponse.data.data.data)) {
      organizations = apiResponse.data.data.data
    } else if (apiResponse?.data?.data && Array.isArray(apiResponse.data.data)) {
      organizations = apiResponse.data.data
    } else if (apiResponse?.data && Array.isArray(apiResponse.data)) {
      organizations = apiResponse.data
    } else if (Array.isArray(apiResponse)) {
      organizations = apiResponse
    } else {
      console.log('Could not find organizations array in response:', apiResponse)
      return []
    }

    if (!Array.isArray(organizations) || organizations.length === 0) {
      return []
    }

    return organizations.map((org: any) => {
    // Get the main enterprise data
    const enterprise = org.enterprises?.[0] || {}
    
    // Format the enterprise data to match our interface
    const transformedEnterprise: EnterpriseData = {
      id: org.organisation_id,
      enterprise: {
        name: org.name || enterprise.name || '-',
        logo: getLogoForEnterprise(org.name || enterprise.name),
        id: enterprise.enterprise_id
      },
      plan: mapPlan(org.plan),
      usage: Math.round(org.usage_percentage || 0),
      type: enterprise.account_type,
      liveArr: org.live_arr || 0,
      rooftops: org.rooftops || 0,
      lastActivity: formatDate(org.last_activity || enterprise.last_activity),
      renewal: formatDate(org.contract_renewal_date || enterprise.renewal_date),
      status: mapStatus(org.stage || enterprise.stage),
      region: mapRegion(org.region),
      size: mapSize(org.account_size),
      products: mapProducts(org.products || enterprise.products || []),
      media: mapMedia(enterprise.product_rows || []),
      credits: {
        totalUsed: org.used_quantity || 0,
        contracted: org.total_quantity,
        unit: enterprise.subscription_volume_unit || "VINs"
      },
      mediaUsage: mapMediaUsage(enterprise.product_rows || []),
      customerExperience: {
        averageNps: org.nps_score || 0,
        tickets: {
          open: org.high_severity_tickets + org.medium_severity_tickets + org.low_severity_tickets || 0,
          closed: enterprise.resolve_ticket || 0
        }
      },
      pocData: {
        accountExecutive: parsePocData(org.poc_ae || enterprise.poc_ae),
        csPoc: parsePocData(org.poc_cs || enterprise.poc_cs),
        obPoc: parsePocData(org.poc_ob || enterprise.poc_ob)
      }
    }

    return transformedEnterprise
  })
  } catch (error) {
    console.error('Error transforming enterprise data:', error)
    return []
  }
}

// Helper functions
function parsePocData(pocString: string | null | undefined): { name: string; email: string } {
  if (!pocString) {
    return { name: 'N/A', email: '' }
  }

  try {
    // If it's already an object, return it
    if (typeof pocString === 'object' && pocString !== null) {
      const poc = pocString as any
      return {
        name: poc.name || 'N/A',
        email: poc.email || ''
      }
    }

    // If it's a JSON string, parse it
    if (typeof pocString === 'string') {
      const parsed = JSON.parse(pocString)
      return {
        name: parsed.name || 'N/A',
        email: parsed.email || ''
      }
    }

    return { name: 'N/A', email: '' }
  } catch (error) {
    // If parsing fails, treat as plain string name
    return {
      name: typeof pocString === 'string' ? pocString : 'N/A',
      email: ''
    }
  }
}

function getLogoForEnterprise(name: string): string {
  const nameLower = (name || '').toLowerCase()
  
  if (nameLower.includes('bmw')) return '/bmw-logo.png'
  if (nameLower.includes('mercedes') || nameLower.includes('benz')) return '/mercedes-benz-logo.png'
  if (nameLower.includes('tesla')) return '/tesla-logo.png'
  if (nameLower.includes('automotive')) return '/automotive-company-logo.png'
  
  return '/placeholder-logo.png'
}

function mapPlan(plan: string): string {
  return plan
}

function mapAccountType(type: string): string {
  return type
}

function mapStatus(status: string): 'Live' | 'Onboarding' | 'Churned' | 'Trial' {
  const statusLower = (status || '').toLowerCase()
  if (statusLower.includes('live') || statusLower.includes('active')) return 'Live'
  if (statusLower.includes('churn') || statusLower.includes('inactive')) return 'Churned'
  if (statusLower.includes('trial') || statusLower.includes('demo')) return 'Trial'
  return 'Onboarding'
}

function mapRegion(region: string): string {
  return region
}

function mapSize(size: string): string {
  return size
}

function mapProducts(products: any[]): Array<{name: string, count: number}> {
  if (!Array.isArray(products)) return []
  
  return products.map(product => ({
    name: product.name || product.product_name || '-',
    count: product.count || product.quantity || 0
  }))
}

function mapMedia(productRows: any[]): {images: number, videos: number, threeSixty: number} {
  if (!Array.isArray(productRows)) {
    return { images: 0, videos: 0, threeSixty: 0 }
  }
  
  return productRows.reduce((acc, row) => {
    if (row.product_name?.toLowerCase().includes('image')) {
      acc.images += row.quantity || 0
    } else if (row.product_name?.toLowerCase().includes('video')) {
      acc.videos += row.quantity || 0
    } else if (row.product_name?.toLowerCase().includes('360')) {
      acc.threeSixty += row.quantity || 0
    }
    return acc
  }, { images: 0, videos: 0, threeSixty: 0 })
}

function mapMediaUsage(productRows: any[]): Array<{type: string, used: number, total: number}> {
  if (!Array.isArray(productRows)) return []
  
  return productRows.map(row => ({
    type: row.product_name || '-',
    used: row.used_quantity || 0,
    total: row.total_quantity || 0
  }))
}

function formatRevenue(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  } else {
    return `$${amount.toFixed(0)}`
  }
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  } catch {
    return 'N/A'
  }
}

// Format currency for display
export function formatCurrencyValue(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`
  } else {
    return `$${amount.toFixed(0)}`
  }
}

// Calculate summary metrics from real enterprise data
export function calculateRealEnterpriseMetrics(data: EnterpriseData[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalRevenue: 0,
      totalEnterprises: 0,
      avgRevenue: 0,
      liveEnterprises: 0
    }
  }

  const totalRevenue = data.reduce((sum, enterprise) => {
    const revenueStr = enterprise.liveArr || 0
    return sum + (typeof revenueStr === 'number' ? revenueStr : 0)
  }, 0)

  const liveEnterprises = data.filter(enterprise => enterprise.status === 'Live').length

  return {
    totalRevenue,
    totalEnterprises: data.length,
    avgRevenue: data.length > 0 ? totalRevenue / data.length : 0,
    liveEnterprises
  }
}

