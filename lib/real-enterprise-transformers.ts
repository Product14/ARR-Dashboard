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

    const transformedData = organizations.map((org: any) => {
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
      status: org.stage || 'Unknown',
      region: mapRegion(org.region),
      size: mapSize(org.account_size),
      products: mapProducts(org.products || enterprise.products || []),
      media: mapMedia(org.products || enterprise.products || []),
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
  
    return transformedData
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


function mapRegion(region: string): string {
  return region
}

function mapSize(size: string): string {
  return size
}

function mapStatus(status: string): 'Live' | 'Contracted' {
  const statusLower = (status || '').toLowerCase()
  if (statusLower.includes('live') || statusLower.includes('active')) return 'Live'
  return 'Contracted'
}

function mapProducts(products: any[]): { name: string; status: "Live" | "Contracted" }[] {
  if (!Array.isArray(products)) return []
  
  return products.map((product: any) => ({
    name: product.product_name || product.name || '-',
    status: mapStatus(product.stage || product.status || 'Contracted') as "Live" | "Contracted"
  }))
}

function mapMedia(products: any[]): { type: string; status: "Live" | "Contracted"; count?: number }[] {
  if (!Array.isArray(products)) return []
  
  return products.map((product: any) => ({
    type: product.product_name || product.name || 'Images',
    status: mapStatus(product.stage || product.status || 'Contracted') as "Live" | "Contracted",
    count: product.lifetime_vins || product.used_quantity || product.count || 0
  }))
}

function mapMediaUsage(productRows: any[]): { type: string; count: number }[] {
  if (!Array.isArray(productRows)) return []
  
  return productRows.map((row: any) => ({
    type: row.product_type || 'Images',
    count: row.lifetime_vins || row.used_quantity || 0
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