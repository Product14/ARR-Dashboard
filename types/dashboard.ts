export interface MetricProps {
  value: string
  label: string
}

export interface AnalyticsData {
  contractedLive: number
  activeProjects: number
  pendingApproval: number
  completedTasks: number
}

export interface EnterpriseData {
  id: string
  enterprise: {
    name: string
    logo: string
    id: string
  }
  plan: string
  usage: number // percentage
  type: string
  liveArr: number
  rooftops: number
  lastActivity: string
  renewal: string
  status: string
  region: string
  size: string
  products: {
    name: string
    status: "Live" | "Contracted"
  }[]
  media: {
    type: string
    status: "Live" | "Contracted"
    count?: number
  }[]
  credits: {
    totalUsed: number
    contracted: number
    unit: string
  }
  mediaUsage: {
    type: string
    count: number
  }[]
  customerExperience: {
    averageNps: number
    tickets: {
      open: number
      closed: number
    }
  }
  pocData?: {
    accountExecutive?: {
      name: string
      email: string
    }
    csPoc?: {
      name: string
      email: string
    }
    obPoc?: {
      name: string
      email: string
    }
  }
}

export interface StatusBadgeProps {
  status: string
}

export interface TrendData {
  value: string
  direction: "up" | "down"
  color: "green" | "red" | "orange"
}

export interface PerformanceMetricData {
  title: string
  primaryValue: string
  primaryLabel?: string
  secondaryValue?: string
  secondaryLabel?: string
  trend: TrendData
  variant?: "default" | "success" | "warning" | "danger"
  valueColor?: string
}

export interface PerformanceAnalyticsData {
  healthScore: number
  contractedLive: number
  contractedLiveRooftops: number
  actualLive: number
  actualLiveRooftops: number
  churned: number
  churnedRooftops: number
}

// API Response Types for Revenue Table
export interface ApiRevenueData {
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
