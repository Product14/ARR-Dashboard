import type { ApiRevenueData, TrendData } from "@/types/dashboard"
import type { MetricData } from "@/components/dashboard/performance-analytics/performance-analytics"
import { formatCurrency, calculatePercentageChange } from "./api-service"

// Enterprise Table API Response Type
interface EnterpriseApiData {
  data: {
    data: Array<{
      organisation_id: string
      name: string
      plan: string
      health_score: number
      account_size: string
      live_arr: number
      contracted_arr: number
      stage: string
      products: Array<{
        plan: string
        product_name: string
        stage: string
      }>
      rooftops: number
      usage_percentage: number
      last_activity: string
      contract_renewal_date: string
      nps_score: number
      // ... other fields
    }>
    hasMoreData: boolean
  }
}

// Transform Enterprise API response to MetricData format for PerformanceAnalytics component
export function transformEnterpriseApiDataToMetrics(apiData: EnterpriseApiData): MetricData[] | null {
  const enterprises = apiData.data?.data || []
  
  if (enterprises.length === 0) {
    // Return null instead of fallback data when no enterprises are available
    return null
  }

  // Calculate aggregated metrics from enterprise data
  const totalLiveArr = enterprises.reduce((sum, ent) => sum + (ent.live_arr || 0), 0)
  const totalContractedArr = enterprises.reduce((sum, ent) => sum + (ent.contracted_arr || 0), 0)
  const totalRooftops = enterprises.reduce((sum, ent) => sum + (ent.rooftops || 0), 0)
  const liveEnterprises = enterprises.filter(ent => ent.stage === 'Live').length
  const contractedEnterprises = enterprises.filter(ent => ent.stage === 'Onboarding' || ent.stage === 'Live').length
  
  // Calculate average health score
  const validHealthScores = enterprises.filter(ent => ent.health_score > 0)
  const avgHealthScore = validHealthScores.length > 0 
    ? validHealthScores.reduce((sum, ent) => sum + ent.health_score, 0) / validHealthScores.length
    : 0

  // Simulate trends (in real scenario, you'd compare with previous period data)
  const healthTrend: TrendData = {
    value: "2.1%",
    direction: "up",
    color: "green"
  }

  const contractedTrend: TrendData = {
    value: "4.5%",
    direction: "up", 
    color: "green"
  }

  const liveTrend: TrendData = {
    value: "3.2%",
    direction: "up",
    color: "green"
  }

  // Calculate churned enterprises (those with churn dates or negative ARR changes)
  const churnedEnterprises = enterprises.filter(ent => 
    ent.stage === 'Churned' || (ent.live_arr === 0 && ent.contracted_arr > 0)
  ).length
  const churnedArr = 600000 // Placeholder - would need historical data

  const churnTrend: TrendData = {
    value: "1.2%",
    direction: "down",
    color: "orange"
  }

  return [
    // Health Score
    {
      title: "Health Score",
      primaryValue: avgHealthScore.toFixed(1),
      trend: healthTrend,
    },
    
    // Contracted Live
    {
      title: "Contracted Live", 
      primaryValue: formatCurrency(totalContractedArr),
      secondaryValue: contractedEnterprises.toString(),
      secondaryLabel: "rooftops",
      trend: contractedTrend,
      secondaryTrend: { value: "1.5%", direction: "up", color: "green" },
      primaryThisMonth: formatCurrency(totalContractedArr * 0.08), // Approximate MTD
      secondaryThisMonth: Math.round(contractedEnterprises * 0.1).toString(),
    },
    
    // Actual Live
    {
      title: "Actual Live",
      primaryValue: formatCurrency(totalLiveArr),
      secondaryValue: liveEnterprises.toString(),
      secondaryLabel: "rooftops",
      trend: liveTrend,
      secondaryTrend: { value: "2.1%", direction: "up", color: "green" },
      valueColor: "rgba(0,0,0,0.6)",
      primaryThisMonth: formatCurrency(totalLiveArr * 0.08), // Approximate MTD
      secondaryThisMonth: Math.round(liveEnterprises * 0.1).toString(),
    },
    
    // Churned
    {
      title: "Churned (Past 12 months)",
      primaryValue: formatCurrency(churnedArr),
      secondaryValue: churnedEnterprises.toString(),
      secondaryLabel: "rooftops", 
      trend: churnTrend,
      secondaryTrend: { value: "0.8%", direction: "down", color: "orange" },
      valueColor: "rgba(0,0,0,0.6)",
      primaryThisMonth: formatCurrency(churnedArr * 0.08),
      secondaryThisMonth: Math.round(churnedEnterprises * 0.1).toString(),
    },
  ]
}


// Transform Revenue API response to MetricData format for PerformanceAnalytics component
// This function ONLY handles Revenue Table API data - NOT Enterprise API data
export function transformApiDataToMetrics(apiData: ApiRevenueData): MetricData[] | null {
  console.log('Performance Overview Data Transformer - Input Data:', apiData)
  console.log('Performance Overview Data Transformer - Data Type Check:', typeof apiData)
  
  // If apiData is null, undefined, or empty, return null
  if (!apiData) {
    console.log('Performance Overview Data Transformer - No API data provided')
    return null
  }
  
  // This function ONLY handles Revenue API data structure
  // If this is called with Enterprise API data, it's an error in the calling code
  if ('data' in apiData && apiData.data && 'data' in apiData.data && Array.isArray(apiData.data.data)) {
    console.error('Performance Overview Data Transformer - ERROR: Enterprise API data passed to Revenue transformer!')
    console.error('Performance Overview Data Transformer - This transformer only handles Revenue API data')
    return null
  }

  // Validate that this is proper Revenue API data structure with required fields
  const revenueData = apiData as ApiRevenueData
  if (!revenueData.healthScore || !revenueData.contractLive || !revenueData.actualLive || !revenueData.churn) {
    console.error('Performance Overview Data Transformer - Invalid Revenue API data structure, missing required fields')
    console.error('Performance Overview Data Transformer - Expected fields: healthScore, contractLive, actualLive, churn')
    console.error('Performance Overview Data Transformer - Available fields:', Object.keys(revenueData))
    return null
  }

  console.log('Performance Overview Data Transformer - Processing Revenue API Data Structure')
  const {
    healthScore,
    contractLive,
    actualLive,
    churn
  } = revenueData

  try {
    // Validate nested structure
    if (!healthScore.overallHealthScore || !healthScore.lastMonthHealthScore) {
      console.error('Performance Overview Data Transformer - Invalid healthScore structure')
      return null
    }
    
    if (!contractLive.ContractLiveRevenue || contractLive.ContractLiveEnterpriseCount === undefined) {
      console.error('Performance Overview Data Transformer - Invalid contractLive structure')
      return null
    }
    
    if (!actualLive.ActualLiveRevenue || actualLive.ActualLiveEnterpriseCount === undefined) {
      console.error('Performance Overview Data Transformer - Invalid actualLive structure')
      return null
    }
    
    if (!churn.Last12MonthsChurnRevenue || churn.Last12MonthsChurnEnterpriseCount === undefined) {
      console.error('Performance Overview Data Transformer - Invalid churn structure')
      return null
    }

    // Calculate trends based on month-to-date vs last month data
    const contractLiveTrend = calculatePercentageChange(
      contractLive.ContractLiveRevenueMtd,
      contractLive.ContractLiveRevenue - contractLive.ContractLiveRevenueMtd
    )

    const actualLiveTrend = calculatePercentageChange(
      actualLive.ActualLiveRevenueMtd,
      actualLive.ActualLiveRevenue - actualLive.ActualLiveRevenueMtd
    )

    const churnTrend = calculatePercentageChange(
      churn.ThisMonthChurnRevenue,
      churn.Last12MonthsChurnRevenue / 12 // Approximate monthly average
    )

    // Health Score trend
    const healthScoreTrend: TrendData = {
      value: calculatePercentageChange(
        parseFloat(healthScore.overallHealthScore),
        parseFloat(healthScore.lastMonthHealthScore.value)
      ).value,
      direction: healthScore.lastMonthHealthScore.more ? "up" : "down",
      color: healthScore.lastMonthHealthScore.more ? "green" : "red"
    }

    console.log('Performance Overview Data Transformer - Successfully transformed revenue data')
    return [
      // Health Score
      {
        title: "Health Score",
        primaryValue: healthScore.overallHealthScore,
        trend: healthScoreTrend,
      },
      
      // Contracted Live
      {
        title: "Contracted Live",
        primaryValue: formatCurrency(contractLive.ContractLiveRevenue),
        secondaryValue: contractLive.ContractLiveEnterpriseCount.toString(),
        secondaryLabel: "rooftops",
        trend: contractLiveTrend,
        secondaryTrend: calculatePercentageChange(
          contractLive.ContractLiveEnterpriseCountMtd,
          contractLive.ContractLiveEnterpriseCount - contractLive.ContractLiveEnterpriseCountMtd
        ),
        primaryThisMonth: formatCurrency(contractLive.ContractLiveRevenueMtd),
        secondaryThisMonth: contractLive.ContractLiveEnterpriseCountMtd.toString(),
      },
      
      // Actual Live
      {
        title: "Actual Live",
        primaryValue: formatCurrency(actualLive.ActualLiveRevenue),
        secondaryValue: actualLive.ActualLiveEnterpriseCount.toString(),
        secondaryLabel: "rooftops",
        trend: actualLiveTrend,
        secondaryTrend: calculatePercentageChange(
          actualLive.ActualLiveEnterpriseCountMtd,
          actualLive.ActualLiveEnterpriseCount - actualLive.ActualLiveEnterpriseCountMtd
        ),
        valueColor: "rgba(0,0,0,0.6)",
        primaryThisMonth: formatCurrency(actualLive.ActualLiveRevenueMtd),
        secondaryThisMonth: actualLive.ActualLiveEnterpriseCountMtd.toString(),
      },
      
      // Churned
      {
        title: "Churned (Past 12 months)",
        primaryValue: formatCurrency(churn.Last12MonthsChurnRevenue),
        secondaryValue: churn.Last12MonthsChurnEnterpriseCount.toString(),
        secondaryLabel: "rooftops",
        trend: churnTrend,
        secondaryTrend: calculatePercentageChange(
          churn.ThisMonthChurnEnterpriseCount,
          churn.Last12MonthsChurnEnterpriseCount / 12 // Approximate monthly average
        ),
        valueColor: "rgba(0,0,0,0.6)",
        primaryThisMonth: formatCurrency(churn.ThisMonthChurnRevenue),
        secondaryThisMonth: churn.ThisMonthChurnEnterpriseCount.toString(),
      },
    ]
  } catch (error) {
    console.error('Performance Overview Data Transformer - Error transforming revenue data:', error)
    return null
  }
}

// Get health score color category based on score value
export function getHealthScoreCategory(score: number): "red" | "amber" | "green" {
  if (score < 4) return "red"
  if (score < 7) return "amber"
  return "green"
}

// Transform health score data for detailed analysis
export function transformHealthScoreData(healthScore: ApiRevenueData['healthScore']) {
  const overallScore = parseFloat(healthScore.overallHealthScore)
  const category = getHealthScoreCategory(overallScore)
  
  return {
    overallScore,
    category,
    lastMonthScore: parseFloat(healthScore.lastMonthHealthScore.value),
    improved: healthScore.lastMonthHealthScore.more,
    breakdown: {
      red: {
        revenue: healthScore.redAccountRevenue,
        count: healthScore.redAccountEnterpriseCount,
      },
      amber: {
        revenue: healthScore.amberAccountRevenue,
        count: healthScore.amberAccountEnterpriseCount,
      },
      green: {
        revenue: healthScore.greenAccountRevenue,
        count: healthScore.greenAccountEnterpriseCount,
      },
    },
  }
}

// Format numbers for display
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
  return num.toString()
}

// Calculate retention rates
export function calculateRetentionMetrics(retention: ApiRevenueData['retention']) {
  return {
    grr: {
      current: retention.grr.percentage,
      lastMonth: retention.grr.lastMonthPercentage,
      improved: retention.grr.more,
      trend: calculatePercentageChange(
        retention.grr.percentage,
        retention.grr.lastMonthPercentage
      ),
    },
    nrr: {
      current: retention.nrr.percentage,
      lastMonth: retention.nrr.lastMonthPercentage,
      improved: retention.nrr.more,
      trend: calculatePercentageChange(
        retention.nrr.percentage,
        retention.nrr.lastMonthPercentage
      ),
    },
  }
}
