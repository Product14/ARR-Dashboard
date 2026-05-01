"use client"

import { useState, useMemo } from "react"
import { SnapshotCard, PeriodCard, CountsCard } from "@/components/dashboard/performance-analytics/performance-analytics"
import { RooftopsTableFilters } from "./onboarding-table-filters"
import { RooftopsTableHeader } from "./onboarding-table-header"

const STAGE_COLORS = {
  live: "#22c55e",
  contracted: "#8b5cf6",
  onboarding: "#f59e0b",
  churned: "#ef4444",
  plg: "#3b82f6",
}

const SUB_STAGE_MAP: Record<string, string[]> = {
  "Contract-Initiated": [],
  "Contracted":  ["Meet Pending", "Meet Scheduled", "Meet Done", "Meet Cancelled", "Meet Rescheduled"],
  "Onboarding":  ["OB To Be Scheduled", "In Implementation", "Under Review", "Client Unresponsive", "CSM Handover Pending", "OB Live"],
  "Live":        ["OB Live"],
  "Churned":     ["Sales Drop off", "OB Drop off", "Drop off"],
}

interface StageSegment { color: string; count: number }

interface SubProductRow {
  id: string
  name: string
  carr: string
  larr: string
  grr: number | null
  nrr: number | null
  stages: StageSegment[]
  subStage?: string
}

interface ProductRow {
  id: string
  name: string
  icon: string
  planCount: number
  carr: string
  carrDelta?: string
  larr: string
  larrDelta?: string
  grr: number | null
  nrr: number | null
  stages: StageSegment[]
  subProducts?: SubProductRow[]
  subStage?: string
  plan?: "Pro" | "Lite"
}

interface RooftopRow {
  id: string
  tCode: string
  name: string
  type: string
  products: ProductRow[]
  carr: string
  carrDelta?: string
  larr: string
  larrDelta?: string
  grr: number | null
  nrr: number | null
  stages: StageSegment[]
  subStage?: string
}

interface EnterpriseRow {
  id: string
  eCode: string
  name: string
  initials: string
  color: string
  tags: string
  dealerSegment?: string
  rooftopCount: number
  rooftops: RooftopRow[]
  carr: string
  carrDelta: string
  larr: string
  larrDelta: string
  grr: number
  nrr: number
  stages: StageSegment[]
  subStage?: string
}

const enterpriseData: EnterpriseRow[] = [
  {
    id: "ent-1",
    eCode: "E001",
    name: "AutoVista Group",
    initials: "A",
    color: "#7c3aed",
    tags: "Group Dealer",
    dealerSegment: "Enterprise",
    rooftopCount: 7,
    carr: "$1.21M",
    carrDelta: "+$88K",
    larr: "$0.92M",
    larrDelta: "+$68K",
    grr: 74.3,
    nrr: 79.4,
    stages: [
      { color: STAGE_COLORS.contracted, count: 2 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.live, count: 1 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-1",
        tCode: "T0005",
        name: "AutoVista · Salt Lake",
        type: "Franchise",
        carr: "$25K",
        carrDelta: "+$2K",
        larr: "$24K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 115.4,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Scheduled",
        products: [
          { id: "p-1", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$25K", larr: "$24K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-1a", name: "Image", carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-1b", name: "Video Tour", carr: "$10K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-2",
        tCode: "T0085",
        name: "AutoVista · Dwarka",
        type: "Franchise",
        carr: "$25K",
        carrDelta: "+$1K",
        larr: "$24K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 104.7,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "In Implementation",
        products: [
          { id: "p-2", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 3, carr: "$25K", larr: "$24K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 3 }], subProducts: [
            { id: "sp-2a", name: "Image", carr: "$10K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-2b", name: "Video Tour", carr: "$8K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-2c", name: "360 Spin", carr: "$7K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-3",
        tCode: "T0094",
        name: "AutoVista · Madhapur",
        type: "Independent",
        carr: "$24K",
        carrDelta: "+$2K",
        larr: "$22K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 102.6,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-3", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$24K", larr: "$22K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-3a", name: "Service IB", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-3b", name: "Sales OB", carr: "$11K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-4",
        tCode: "T0014",
        name: "AutoVista · Baroda Alkapuri",
        type: "Franchise",
        carr: "$23K",
        carrDelta: "+$1K",
        larr: "$21K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 110.8,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "CSM Handover Pending",
        products: [
          { id: "p-4", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$23K", larr: "$21K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-5",
        tCode: "T0027",
        name: "AutoVista · Nashik College Road",
        type: "Independent",
        carr: "$23K",
        carrDelta: "+$1K",
        larr: "$11K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 105.3,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Pending",
        products: [
          { id: "p-5", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$12K", carrDelta: "+$1K", larr: "$6K", larrDelta: "+$1K", grr: 100.0, nrr: 100.0, stages: [{ color: STAGE_COLORS.contracted, count: 1 }, { color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-5a", name: "Service IB", carr: "$6K", larr: "$3K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
            { id: "sp-5b", name: "Service OB", carr: "$6K", larr: "$3K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-6", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$10K", carrDelta: "+$1K", larr: "$5K", larrDelta: "+$1K", grr: 100.0, nrr: 111.1, stages: [{ color: STAGE_COLORS.contracted, count: 1 }, { color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-6a", name: "Image", carr: "$6K", larr: "$3K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
            { id: "sp-6b", name: "360 Spin", carr: "$5K", larr: "$2K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-6",
        tCode: "T0049",
        name: "AutoVista · Silchar College Road",
        type: "Independent",
        carr: "$22K",
        carrDelta: "+$2K",
        larr: "$21K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Drop off",
        products: [
          { id: "p-7", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$22K", larr: "$21K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-7a", name: "Image", carr: "$22K", larr: "$21K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-7",
        tCode: "T0077",
        name: "AutoVista · Coimbatore BS Puram",
        type: "Independent",
        carr: "$22K",
        larr: "$8K",
        grr: null,
        nrr: null,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Done",
        products: [],
      },
    ],
  },
  {
    id: "ent-2",
    eCode: "E002",
    name: "DriveNation Retail",
    initials: "D",
    color: "#0284c7",
    tags: "Group Dealer",
    dealerSegment: "Mid Market",
    rooftopCount: 5,
    carr: "$0.96M",
    carrDelta: "+$49K",
    larr: "$0.73M",
    larrDelta: "+$38K",
    grr: 92.5,
    nrr: 101.2,
    stages: [
      { color: STAGE_COLORS.live, count: 1 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.contracted, count: 1 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-8",
        tCode: "T0023",
        name: "DriveNation · Mumbai Central",
        type: "Franchise",
        carr: "$30K",
        carrDelta: "+$2K",
        larr: "$28K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 107.8,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-8", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$30K", larr: "$28K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-8a", name: "Image", carr: "$17K", larr: "$16K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-8b", name: "Video Tour", carr: "$14K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-9",
        tCode: "T0031",
        name: "DriveNation · Pune Kothrud",
        type: "Franchise",
        carr: "$27K",
        carrDelta: "+$1K",
        larr: "$25K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 103.1,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "Under Review",
        products: [
          { id: "p-9", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$27K", larr: "$25K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-10",
        tCode: "T0062",
        name: "DriveNation · Bangalore Whitefield",
        type: "Independent",
        carr: "$24K",
        carrDelta: "+$3K",
        larr: "$23K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 112.3,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Done",
        products: [
          { id: "p-10", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$11K", carrDelta: "+$1K", larr: "$10K", larrDelta: "+$1K", grr: 100.0, nrr: 108.0, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-10a", name: "Sales IB", carr: "$6K", larr: "$6K", grr: 100.0, nrr: 108.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-10b", name: "Sales OB", carr: "$5K", larr: "$5K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-11", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$13K", carrDelta: "+$2K", larr: "$12K", larrDelta: "+$1K", grr: 100.0, nrr: 116.0, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.contracted, count: 1 }], subProducts: [
            { id: "sp-11a", name: "Image", carr: "$7K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-11b", name: "Video Tour", carr: "$6K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-11",
        tCode: "T0078",
        name: "DriveNation · Chennai Velachery",
        type: "Independent",
        carr: "$20K",
        larr: "$0",
        grr: 0.0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "OB Drop off",
        products: [
          { id: "p-12", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$20K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-12a", name: "Image", carr: "$20K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-12",
        tCode: "T0091",
        name: "DriveNation · Hyderabad Banjara Hills",
        type: "Franchise",
        carr: "$23K",
        carrDelta: "+$1K",
        larr: "$22K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "OB To Be Scheduled",
        products: [
          { id: "p-13", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$23K", larr: "$22K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-13a", name: "Image", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-13b", name: "360 Spin", carr: "$10K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
    ],
  },
  {
    id: "ent-3",
    eCode: "E003",
    name: "PremiumWheels India",
    initials: "P",
    color: "#059669",
    tags: "Individual Dealer",
    dealerSegment: "SMB",
    rooftopCount: 4,
    carr: "$0.63M",
    carrDelta: "+$30K",
    larr: "$0.57M",
    larrDelta: "+$23K",
    grr: 88.4,
    nrr: 94.7,
    stages: [
      { color: STAGE_COLORS.live, count: 1 },
      { color: STAGE_COLORS.onboarding, count: 1 },
      { color: STAGE_COLORS.contracted, count: 1 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-13",
        tCode: "T0033",
        name: "PremiumWheels · Delhi Connaught Place",
        type: "Franchise",
        carr: "$32K",
        carrDelta: "+$3K",
        larr: "$31K",
        larrDelta: "+$3K",
        grr: 100.0,
        nrr: 119.4,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-14", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$20K", carrDelta: "+$2K", larr: "$19K", larrDelta: "+$2K", grr: 100.0, nrr: 115.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-14a", name: "Image", carr: "$11K", larr: "$11K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-14b", name: "Video Tour", carr: "$8K", larr: "$8K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-15", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$12K", carrDelta: "+$2K", larr: "$12K", larrDelta: "+$1K", grr: 100.0, nrr: 125.0, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-15a", name: "Service IB", carr: "$7K", larr: "$7K", grr: 100.0, nrr: 125.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-15b", name: "Sales IB", carr: "$5K", larr: "$5K", grr: 100.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-14",
        tCode: "T0044",
        name: "PremiumWheels · Gurgaon Sector 29",
        type: "Independent",
        carr: "$28K",
        carrDelta: "+$2K",
        larr: "$26K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 106.2,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "In Implementation",
        products: [
          { id: "p-16", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$28K", larr: "$26K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-16a", name: "Service IB", carr: "$9K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-16b", name: "Service OB", carr: "$9K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-16c", name: "Sales OB", carr: "$9K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-15",
        tCode: "T0057",
        name: "PremiumWheels · Noida Sector 18",
        type: "Franchise",
        carr: "$25K",
        larr: "$16K",
        grr: 64.6,
        nrr: null,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Rescheduled",
        products: [
          { id: "p-17", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 3, carr: "$25K", larr: "$16K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.onboarding, count: 2 }], subProducts: [
            { id: "sp-17a", name: "Image", carr: "$10K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-17b", name: "Video Tour", carr: "$8K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
            { id: "sp-17c", name: "360 Spin", carr: "$6K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-16",
        tCode: "T0068",
        name: "PremiumWheels · Jaipur Malviya Nagar",
        type: "Independent",
        carr: "$21K",
        carrDelta: "+$1K",
        larr: "$20K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Sales Drop off",
        products: [
          { id: "p-18", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$21K", larr: "$20K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
    ],
  },
  {
    id: "ent-4",
    eCode: "E004",
    name: "Velocity Motors",
    initials: "V",
    color: "#dc2626",
    tags: "Individual Dealer",
    dealerSegment: "Reseller",
    rooftopCount: 2,
    carr: "$35K",
    carrDelta: "+$6K",
    larr: "$27K",
    larrDelta: "+$4K",
    grr: 76.5,
    nrr: 82.1,
    stages: [
      { color: STAGE_COLORS.onboarding, count: 1 },
      { color: STAGE_COLORS.contracted, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-17",
        tCode: "T0019",
        name: "Velocity Motors · Ahmedabad SG Highway",
        type: "Independent",
        carr: "$19K",
        carrDelta: "+$4K",
        larr: "$15K",
        larrDelta: "+$2K",
        grr: 77.8,
        nrr: 88.9,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "Client Unresponsive",
        products: [
          { id: "p-19", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$19K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }, { color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-19a", name: "Image", carr: "$10K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-19b", name: "Video Tour", carr: "$8K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-18",
        tCode: "T0053",
        name: "Velocity Motors · Surat Ring Road",
        type: "Independent",
        carr: "$17K",
        carrDelta: "+$3K",
        larr: "$12K",
        larrDelta: "+$2K",
        grr: 75.0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Scheduled",
        products: [
          { id: "p-20", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$9K", carrDelta: "+$1K", larr: "$7K", larrDelta: "+$1K", grr: 77.8, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-20a", name: "Sales IB", carr: "$5K", larr: "$4K", grr: 80.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-20b", name: "Sales OB", carr: "$4K", larr: "$3K", grr: 75.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-21", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$7K", carrDelta: "+$2K", larr: "$5K", larrDelta: "+$1K", grr: 71.4, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 2 }] },
        ],
      },
    ],
  },
  {
    id: "ent-5",
    eCode: "E005",
    name: "Nexus AutoGroup",
    initials: "N",
    color: "#d97706",
    tags: "Group Dealer",
    dealerSegment: "Enterprise",
    rooftopCount: 6,
    carr: "$1.49M",
    carrDelta: "+$109K",
    larr: "$1.32M",
    larrDelta: "+$96K",
    grr: 96.2,
    nrr: 108.5,
    stages: [
      { color: STAGE_COLORS.live, count: 2 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.contracted, count: 1 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-19",
        tCode: "T0002",
        name: "Nexus Auto · Kolkata Park Street",
        type: "Franchise",
        carr: "$37K",
        carrDelta: "+$4K",
        larr: "$35K",
        larrDelta: "+$4K",
        grr: 100.0,
        nrr: 122.9,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-22", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$22K", carrDelta: "+$2K", larr: "$21K", larrDelta: "+$2K", grr: 100.0, nrr: 118.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-22a", name: "Image", carr: "$12K", larr: "$12K", grr: 100.0, nrr: 120.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-22b", name: "360 Spin", carr: "$9K", larr: "$9K", grr: 100.0, nrr: 115.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-23", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$15K", carrDelta: "+$2K", larr: "$15K", larrDelta: "+$2K", grr: 100.0, nrr: 129.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-23a", name: "Service IB", carr: "$8K", larr: "$7K", grr: 100.0, nrr: 133.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-23b", name: "Service OB", carr: "$7K", larr: "$7K", grr: 100.0, nrr: 125.0, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-20",
        tCode: "T0008",
        name: "Nexus Auto · Bhopal MP Nagar",
        type: "Franchise",
        carr: "$29K",
        carrDelta: "+$2K",
        larr: "$27K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 105.8,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-24", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$29K", larr: "$27K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-24a", name: "Image", carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-24b", name: "Video Tour", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-21",
        tCode: "T0017",
        name: "Nexus Auto · Lucknow Hazratganj",
        type: "Franchise",
        carr: "$26K",
        carrDelta: "+$2K",
        larr: "$24K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 101.7,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "CSM Handover Pending",
        products: [
          { id: "p-25", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$26K", larr: "$24K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-25a", name: "Service IB", carr: "$15K", larr: "$14K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-25b", name: "Sales IB", carr: "$11K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-22",
        tCode: "T0039",
        name: "Nexus Auto · Indore Vijay Nagar",
        type: "Independent",
        carr: "$24K",
        carrDelta: "+$1K",
        larr: "$22K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Done",
        products: [
          { id: "p-26", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$24K", larr: "$22K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }] },
        ],
      },
      {
        id: "rt-23",
        tCode: "T0055",
        name: "Nexus Auto · Nagpur Sitabuldi",
        type: "Franchise",
        carr: "$22K",
        larr: "$15K",
        grr: 67.4,
        nrr: null,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "In Implementation",
        products: [
          { id: "p-27", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 3, carr: "$22K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.onboarding, count: 2 }], subProducts: [
            { id: "sp-27a", name: "Image", carr: "$9K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-27b", name: "Video Tour", carr: "$7K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
            { id: "sp-27c", name: "360 Spin", carr: "$6K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-24",
        tCode: "T0066",
        name: "Nexus Auto · Patna Bailey Road",
        type: "Independent",
        carr: "$20K",
        carrDelta: "+$1K",
        larr: "$18K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Drop off",
        products: [
          { id: "p-28", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$20K", larr: "$18K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-28a", name: "Service OB", carr: "$10K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-28b", name: "Sales IB", carr: "$9K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
    ],
  },
  {
    id: "ent-6",
    eCode: "E006",
    name: "Horizon Auto Retail",
    initials: "H",
    color: "#0891b2",
    tags: "Franchise Dealer",
    dealerSegment: "Mid Market",
    rooftopCount: 8,
    carr: "$1.63M",
    carrDelta: "+$119K",
    larr: "$1.51M",
    larrDelta: "+$102K",
    grr: 98.1,
    nrr: 112.4,
    stages: [
      { color: STAGE_COLORS.live, count: 3 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.contracted, count: 2 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-25",
        tCode: "T0101",
        name: "Horizon Auto · Pune Aundh",
        type: "Franchise",
        carr: "$35K",
        carrDelta: "+$3K",
        larr: "$34K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 117.2,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-29", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$21K", carrDelta: "+$2K", larr: "$20K", larrDelta: "+$1K", grr: 100.0, nrr: 114.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-29a", name: "Image", carr: "$11K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-29b", name: "360 Spin", carr: "$9K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-30", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$15K", carrDelta: "+$1K", larr: "$14K", larrDelta: "+$1K", grr: 100.0, nrr: 122.0, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-30a", name: "Service IB", carr: "$8K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-30b", name: "Sales IB", carr: "$6K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-26",
        tCode: "T0102",
        name: "Horizon Auto · Mumbai Andheri",
        type: "Franchise",
        carr: "$33K",
        carrDelta: "+$3K",
        larr: "$31K",
        larrDelta: "+$3K",
        grr: 100.0,
        nrr: 120.0,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Pending",
        products: [
          { id: "p-31", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$33K", larr: "$31K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-31a", name: "Image", carr: "$18K", larr: "$17K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-31b", name: "Video Tour", carr: "$15K", larr: "$14K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-27",
        tCode: "T0103",
        name: "Horizon Auto · Bangalore Indiranagar",
        type: "Franchise",
        carr: "$31K",
        carrDelta: "+$2K",
        larr: "$29K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 109.3,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "Under Review",
        products: [
          { id: "p-32", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$31K", larr: "$29K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-32a", name: "Service IB", carr: "$10K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-32b", name: "Service OB", carr: "$11K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-32c", name: "Sales OB", carr: "$9K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-28",
        tCode: "T0104",
        name: "Horizon Auto · Delhi Rohini",
        type: "Independent",
        carr: "$27K",
        carrDelta: "+$2K",
        larr: "$25K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 105.1,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-33", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          { id: "p-34", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$11K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-29",
        tCode: "T0105",
        name: "Horizon Auto · Chennai OMR",
        type: "Franchise",
        carr: "$24K",
        larr: "$17K",
        grr: 68.1,
        nrr: null,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "OB To Be Scheduled",
        products: [
          { id: "p-35", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 3, carr: "$24K", larr: "$17K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.onboarding, count: 2 }], subProducts: [
            { id: "sp-35a", name: "Image", carr: "$9K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-35b", name: "Video Tour", carr: "$8K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
            { id: "sp-35c", name: "360 Spin", carr: "$7K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-30",
        tCode: "T0106",
        name: "Horizon Auto · Hyderabad Gachibowli",
        type: "Franchise",
        carr: "$23K",
        carrDelta: "+$1K",
        larr: "$22K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "OB Drop off",
        products: [
          { id: "p-36", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$23K", larr: "$22K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
        ],
      },
      {
        id: "rt-31",
        tCode: "T0107",
        name: "Horizon Auto · Kolkata New Town",
        type: "Independent",
        carr: "$21K",
        carrDelta: "+$2K",
        larr: "$20K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 107.7,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Scheduled",
        products: [
          { id: "p-37", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$21K", larr: "$20K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-37a", name: "Sales IB", carr: "$11K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-37b", name: "Sales OB", carr: "$10K", larr: "$9K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-32",
        tCode: "T0108",
        name: "Horizon Auto · Surat Adajan",
        type: "Franchise",
        carr: "$20K",
        carrDelta: "+$1K",
        larr: "$19K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-38", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$20K", larr: "$19K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
    ],
  },
  {
    id: "ent-7",
    eCode: "E007",
    name: "Meridian Motors",
    initials: "M",
    color: "#be185d",
    tags: "Independent Dealer",
    dealerSegment: "SMB",
    rooftopCount: 3,
    carr: "$51K",
    carrDelta: "+$9K",
    larr: "$38K",
    larrDelta: "+$6K",
    grr: 75.5,
    nrr: 80.2,
    stages: [
      { color: STAGE_COLORS.onboarding, count: 1 },
      { color: STAGE_COLORS.churned, count: 1 },
      { color: STAGE_COLORS.contracted, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-33",
        tCode: "T0109",
        name: "Meridian Motors · Kochi Marine Drive",
        type: "Independent",
        carr: "$23K",
        carrDelta: "+$4K",
        larr: "$20K",
        larrDelta: "+$3K",
        grr: 86.4,
        nrr: 95.5,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "In Implementation",
        products: [
          { id: "p-39", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$14K", carrDelta: "+$3K", larr: "$11K", larrDelta: "+$2K", grr: 84.6, nrr: 95.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-39a", name: "Image", carr: "$7K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-39b", name: "Video Tour", carr: "$6K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-40", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$9K", carrDelta: "+$2K", larr: "$8K", larrDelta: "+$1K", grr: 88.9, nrr: 96.3, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-40a", name: "Service IB", carr: "$5K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-40b", name: "Sales OB", carr: "$4K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-34",
        tCode: "T0110",
        name: "Meridian Motors · Coimbatore Tidel Park",
        type: "Independent",
        carr: "$17K",
        larr: "$0",
        grr: 0.0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Sales Drop off",
        products: [
          { id: "p-41", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$17K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-41a", name: "Service IB", carr: "$9K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
            { id: "sp-41b", name: "Sales IB", carr: "$7K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-35",
        tCode: "T0111",
        name: "Meridian Motors · Trivandrum Kowdiar",
        type: "Independent",
        carr: "$11K",
        carrDelta: "+$1K",
        larr: "$10K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Cancelled",
        products: [
          { id: "p-42", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$11K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
        ],
      },
    ],
  },
  {
    id: "ent-8",
    eCode: "E008",
    name: "Pinnacle Car World",
    initials: "P",
    color: "#16a34a",
    tags: "Group Dealer",
    dealerSegment: "Enterprise",
    rooftopCount: 9,
    carr: "$2.19M",
    carrDelta: "+$164K",
    larr: "$2.07M",
    larrDelta: "+$151K",
    grr: 99.2,
    nrr: 116.8,
    stages: [
      { color: STAGE_COLORS.live, count: 3 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.contracted, count: 2 },
      { color: STAGE_COLORS.churned, count: 1 },
      { color: STAGE_COLORS.plg, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-36",
        tCode: "T0112",
        name: "Pinnacle · Gurgaon DLF Cyber City",
        type: "Franchise",
        carr: "$40K",
        carrDelta: "+$4K",
        larr: "$38K",
        larrDelta: "+$4K",
        grr: 100.0,
        nrr: 126.0,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-43", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$23K", carrDelta: "+$3K", larr: "$22K", larrDelta: "+$2K", grr: 100.0, nrr: 123.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-43a", name: "Image", carr: "$12K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-43b", name: "360 Spin", carr: "$10K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-44", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$17K", carrDelta: "+$2K", larr: "$16K", larrDelta: "+$2K", grr: 100.0, nrr: 130.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-44a", name: "Service IB", carr: "$9K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-44b", name: "Service OB", carr: "$8K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-37",
        tCode: "T0113",
        name: "Pinnacle · Noida Expressway",
        type: "Franchise",
        carr: "$37K",
        carrDelta: "+$4K",
        larr: "$35K",
        larrDelta: "+$3K",
        grr: 100.0,
        nrr: 118.5,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Scheduled",
        products: [
          { id: "p-45", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 3, carr: "$37K", larr: "$35K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 3 }], subProducts: [
            { id: "sp-45a", name: "Image", carr: "$14K", larr: "$13K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-45b", name: "Video Tour", carr: "$12K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-45c", name: "360 Spin", carr: "$11K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-38",
        tCode: "T0114",
        name: "Pinnacle · Mumbai Powai",
        type: "Franchise",
        carr: "$34K",
        carrDelta: "+$3K",
        larr: "$32K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 111.3,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "OB To Be Scheduled",
        products: [
          { id: "p-46", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$34K", larr: "$32K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-46a", name: "Sales IB", carr: "$18K", larr: "$17K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-46b", name: "Sales OB", carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-39",
        tCode: "T0115",
        name: "Pinnacle · Bangalore Whitefield",
        type: "Independent",
        carr: "$30K",
        carrDelta: "+$2K",
        larr: "$29K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 108.0,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-47", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$17K", larr: "$16K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          { id: "p-48", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$14K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-40",
        tCode: "T0116",
        name: "Pinnacle · Chennai Nungambakkam",
        type: "Franchise",
        carr: "$28K",
        carrDelta: "+$2K",
        larr: "$27K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 105.9,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Done",
        products: [
          { id: "p-49", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$28K", larr: "$27K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-49a", name: "Image", carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-49b", name: "Video Tour", carr: "$12K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-41",
        tCode: "T0117",
        name: "Pinnacle · Pune Baner",
        type: "Franchise",
        carr: "$25K",
        carrDelta: "+$1K",
        larr: "$24K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "Client Unresponsive",
        products: [
          { id: "p-50", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$25K", larr: "$24K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }], subProducts: [
            { id: "sp-50a", name: "Service OB", carr: "$14K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
            { id: "sp-50b", name: "Sales IB", carr: "$12K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-42",
        tCode: "T0118",
        name: "Pinnacle · Hyderabad Jubilee Hills",
        type: "Franchise",
        carr: "$24K",
        carrDelta: "+$2K",
        larr: "$23K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 109.1,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "OB Drop off",
        products: [
          { id: "p-51", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$24K", larr: "$23K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-51a", name: "Image", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-51b", name: "360 Spin", carr: "$11K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-43",
        tCode: "T0119",
        name: "Pinnacle · Delhi Vasant Kunj",
        type: "Independent",
        carr: "$22K",
        carrDelta: "+$1K",
        larr: "$21K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-52", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$22K", larr: "$21K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-44",
        tCode: "T0120",
        name: "Pinnacle · Kolkata Rajarhat",
        type: "Franchise",
        carr: "$21K",
        carrDelta: "+$1K",
        larr: "$20K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.plg, count: 1 }],
        products: [
          { id: "p-53", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$21K", larr: "$20K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
        ],
      },
    ],
  },
  {
    id: "ent-9",
    eCode: "E009",
    name: "Crest Auto Solutions",
    initials: "C",
    color: "#9333ea",
    tags: "Partner",
    dealerSegment: "Reseller",
    rooftopCount: 4,
    carr: "$0.81M",
    carrDelta: "+$46K",
    larr: "$0.70M",
    larrDelta: "+$33K",
    grr: 85.9,
    nrr: 97.3,
    stages: [
      { color: STAGE_COLORS.live, count: 1 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-45",
        tCode: "T0121",
        name: "Crest Auto · Ahmedabad Prahlad Nagar",
        type: "Franchise",
        carr: "$29K",
        carrDelta: "+$2K",
        larr: "$27K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 113.5,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-54", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$29K", larr: "$27K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-54a", name: "Image", carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-54b", name: "Video Tour", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-46",
        tCode: "T0122",
        name: "Crest Auto · Rajkot Gondal Road",
        type: "Independent",
        carr: "$25K",
        carrDelta: "+$2K",
        larr: "$23K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 106.7,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "Under Review",
        products: [
          { id: "p-55", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$25K", larr: "$23K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-55a", name: "Service IB", carr: "$14K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-55b", name: "Sales OB", carr: "$11K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-47",
        tCode: "T0123",
        name: "Crest Auto · Vadodara Alkapuri",
        type: "Franchise",
        carr: "$22K",
        larr: "$12K",
        grr: 54.8,
        nrr: null,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "In Implementation",
        products: [
          { id: "p-56", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$12K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }, { color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-56a", name: "Image", carr: "$7K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
            { id: "sp-56b", name: "360 Spin", carr: "$6K", larr: "$3K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
          { id: "p-57", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$9K", larr: "$5K", grr: 50.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.onboarding, count: 1 }], subProducts: [
            { id: "sp-57a", name: "Service IB", carr: "$5K", larr: "$3K", grr: 50.0, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-57b", name: "Sales IB", carr: "$4K", larr: "$2K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-48",
        tCode: "T0124",
        name: "Crest Auto · Surat Athwalines",
        type: "Independent",
        carr: "$19K",
        larr: "$0",
        grr: 0.0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Drop off",
        products: [
          { id: "p-58", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$19K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-58a", name: "Image", carr: "$10K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
            { id: "sp-58b", name: "Video Tour", carr: "$8K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
    ],
  },
  {
    id: "ent-10",
    eCode: "E010",
    name: "Apex Drive Network",
    initials: "A",
    color: "#b45309",
    tags: "Group Dealer",
    dealerSegment: "Mid Market",
    rooftopCount: 7,
    carr: "$1.83M",
    carrDelta: "+$136K",
    larr: "$1.71M",
    larrDelta: "+$125K",
    grr: 97.4,
    nrr: 114.2,
    stages: [
      { color: STAGE_COLORS.live, count: 2 },
      { color: STAGE_COLORS.contracted, count: 2 },
      { color: STAGE_COLORS.onboarding, count: 2 },
      { color: STAGE_COLORS.churned, count: 1 },
    ],
    rooftops: [
      {
        id: "rt-49",
        tCode: "T0125",
        name: "Apex Drive · Chandigarh Sector 17",
        type: "Franchise",
        carr: "$38K",
        carrDelta: "+$5K",
        larr: "$37K",
        larrDelta: "+$4K",
        grr: 100.0,
        nrr: 124.7,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-59", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 2, carr: "$23K", carrDelta: "+$3K", larr: "$22K", larrDelta: "+$3K", grr: 100.0, nrr: 121.0, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-59a", name: "Image", carr: "$13K", larr: "$12K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-59b", name: "Video Tour", carr: "$10K", larr: "$10K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
          { id: "p-60", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$15K", carrDelta: "+$2K", larr: "$15K", larrDelta: "+$2K", grr: 100.0, nrr: 130.0, stages: [{ color: STAGE_COLORS.live, count: 1 }], subProducts: [
            { id: "sp-60a", name: "Service IB", carr: "$8K", larr: "$8K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-60b", name: "Sales IB", carr: "$7K", larr: "$7K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-50",
        tCode: "T0126",
        name: "Apex Drive · Ludhiana Ferozepur Road",
        type: "Franchise",
        carr: "$34K",
        carrDelta: "+$3K",
        larr: "$33K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 112.7,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Rescheduled",
        products: [
          { id: "p-61", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 2, carr: "$34K", larr: "$33K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-61a", name: "Image", carr: "$19K", larr: "$18K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-61b", name: "360 Spin", carr: "$15K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-51",
        tCode: "T0127",
        name: "Apex Drive · Amritsar Mall Road",
        type: "Independent",
        carr: "$31K",
        carrDelta: "+$2K",
        larr: "$29K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 108.9,
        stages: [{ color: STAGE_COLORS.live, count: 1 }],
        subStage: "OB Live",
        products: [
          { id: "p-62", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$31K", larr: "$29K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 2 }], subProducts: [
            { id: "sp-62a", name: "Service OB", carr: "$17K", larr: "$16K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-62b", name: "Sales OB", carr: "$14K", larr: "$14K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-52",
        tCode: "T0128",
        name: "Apex Drive · Jaipur Tonk Road",
        type: "Franchise",
        carr: "$28K",
        carrDelta: "+$2K",
        larr: "$26K",
        larrDelta: "+$2K",
        grr: 100.0,
        nrr: 105.3,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "CSM Handover Pending",
        products: [
          { id: "p-63", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$16K", larr: "$15K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
          { id: "p-64", name: "Vini AI", icon: "🌿", planCount: 1, carr: "$12K", larr: "$11K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
      {
        id: "rt-53",
        tCode: "T0129",
        name: "Apex Drive · Bhopal Hoshangabad Road",
        type: "Franchise",
        carr: "$24K",
        carrDelta: "+$1K",
        larr: "$23K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.contracted, count: 1 }],
        subStage: "Meet Pending",
        products: [
          { id: "p-65", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$24K", larr: "$23K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.contracted, count: 1 }] },
        ],
      },
      {
        id: "rt-54",
        tCode: "T0130",
        name: "Apex Drive · Indore AB Road",
        type: "Independent",
        carr: "$23K",
        larr: "$16K",
        grr: 68.2,
        nrr: null,
        stages: [{ color: STAGE_COLORS.onboarding, count: 1 }],
        subStage: "OB To Be Scheduled",
        products: [
          { id: "p-66", name: "Vini AI", icon: "🌿", planCount: 3, carr: "$23K", larr: "$16K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }, { color: STAGE_COLORS.onboarding, count: 2 }], subProducts: [
            { id: "sp-66a", name: "Service IB", carr: "$8K", larr: "$6K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
            { id: "sp-66b", name: "Service OB", carr: "$8K", larr: "$5K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
            { id: "sp-66c", name: "Sales IB", carr: "$7K", larr: "$4K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.onboarding, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-55",
        tCode: "T0131",
        name: "Apex Drive · Nagpur Wardha Road",
        type: "Franchise",
        carr: "$21K",
        carrDelta: "+$1K",
        larr: "$20K",
        larrDelta: "+$1K",
        grr: 100.0,
        nrr: 100.0,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Sales Drop off",
        products: [
          { id: "p-67", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$21K", larr: "$20K", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.live, count: 1 }] },
        ],
      },
    ],
  },
  {
    id: "ent-11",
    eCode: "E011",
    name: "Summit Autos",
    initials: "S",
    color: "#6b7280",
    tags: "Group Dealer",
    dealerSegment: "Mid Market",
    rooftopCount: 3,
    carr: "$0.18M",
    carrDelta: "",
    larr: "$0",
    larrDelta: "",
    grr: 0,
    nrr: 0,
    stages: [{ color: STAGE_COLORS.churned, count: 3 }],
    rooftops: [
      {
        id: "rt-churn-1",
        tCode: "T0101",
        name: "Summit Autos · Chandigarh Sector 17",
        type: "Franchise",
        carr: "$72K",
        larr: "$0",
        grr: 0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Drop off",
        products: [
          { id: "p-c1", name: "Studio AI", icon: "🖼️", plan: "Pro", planCount: 1, carr: "$72K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-c1a", name: "Image", carr: "$40K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
            { id: "sp-c1b", name: "Video Tour", carr: "$32K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-churn-2",
        tCode: "T0102",
        name: "Summit Autos · Ludhiana Model Town",
        type: "Independent",
        carr: "$58K",
        larr: "$0",
        grr: 0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "OB Drop off",
        products: [
          { id: "p-c2", name: "Vini AI", icon: "🌿", planCount: 2, carr: "$58K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 2 }], subProducts: [
            { id: "sp-c2a", name: "Service IB", carr: "$30K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
            { id: "sp-c2b", name: "Sales OB", carr: "$28K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
      {
        id: "rt-churn-3",
        tCode: "T0103",
        name: "Summit Autos · Amritsar Mall Road",
        type: "Franchise",
        carr: "$50K",
        larr: "$0",
        grr: 0,
        nrr: null,
        stages: [{ color: STAGE_COLORS.churned, count: 1 }],
        subStage: "Sales Drop off",
        products: [
          { id: "p-c3", name: "Studio AI", icon: "🖼️", plan: "Lite", planCount: 1, carr: "$50K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }], subProducts: [
            { id: "sp-c3a", name: "Image", carr: "$50K", larr: "$0", grr: null, nrr: null, stages: [{ color: STAGE_COLORS.churned, count: 1 }] },
          ]},
        ],
      },
    ],
  },
]

const COLOR_TO_STAGE: Record<string, string> = {
  [STAGE_COLORS.live]: "Live",
  [STAGE_COLORS.contracted]: "Contracted",
  [STAGE_COLORS.onboarding]: "Onboarding",
  [STAGE_COLORS.churned]: "Churned",
  [STAGE_COLORS.plg]: "PLG",
}

const DEALER_TYPE_BADGE_STYLES: Record<string, string> = {
  "Group Dealer":      "bg-blue-100 text-blue-500 border border-blue-200",
  "Marketplace":       "bg-lime-100 text-lime-700 border border-lime-300",
  "Partner":           "bg-amber-100 text-amber-700 border border-amber-200",
  "Auction Platform":  "bg-pink-100 text-pink-700 border border-pink-200",
  "Others":            "bg-purple-100 text-purple-500 border border-purple-200",
  "Individual Dealer": "bg-lime-100 text-lime-700 border border-lime-300",
}

const DEALER_SEGMENT_BADGE_STYLES: Record<string, string> = {
  "Enterprise": "bg-indigo-100 text-indigo-700 border border-indigo-200",
  "Mid Market": "bg-teal-100 text-teal-700 border border-teal-200",
  "SMB":        "bg-orange-100 text-orange-700 border border-orange-200",
  "Reseller":   "bg-rose-100 text-rose-700 border border-rose-200",
}

const STAGE_BADGE_STYLES: Record<string, string> = {
  Live: "bg-green-100 text-green-700 border border-green-200",
  Contracted: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Onboarding: "bg-gray-100 text-gray-600 border border-gray-200",
  Churned: "bg-red-100 text-red-600 border border-red-200",
  PLG: "bg-blue-100 text-blue-600 border border-blue-200",
  "Contract Initiated": "bg-purple-100 text-purple-700 border border-purple-200",
  "Drop Off": "bg-orange-100 text-orange-700 border border-orange-200",
}

function PlanBadge({ plan }: { plan?: "Pro" | "Lite" }) {
  if (!plan) return null
  const style = plan === "Pro"
    ? "bg-purple-100 text-purple-700 border border-purple-200"
    : "bg-sky-100 text-sky-700 border border-sky-200"
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[6px] text-xs font-medium ${style}`}>
      {plan}
    </span>
  )
}

function StageBadge({ segments }: { segments: StageSegment[] }) {
  if (!segments.length) return <span className="text-sm text-gray-300">—</span>
  const dominant = segments.reduce((a, b) => (b.count > a.count ? b : a), segments[0])
  const name = COLOR_TO_STAGE[dominant.color] ?? "Unknown"
  const style = STAGE_BADGE_STYLES[name] ?? "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-xs font-medium ${style}`}>
      {name}
    </span>
  )
}

const SUB_STAGE_BADGE_STYLES: Record<string, string> = {
  // Contracted sub-stages
  "Meet Pending":       "bg-yellow-50 text-yellow-700 border border-yellow-200",
  "Meet Scheduled":     "bg-blue-50 text-blue-700 border border-blue-200",
  "Meet Done":          "bg-green-50 text-green-700 border border-green-200",
  "Meet Cancelled":     "bg-red-50 text-red-600 border border-red-200",
  "Meet Rescheduled":   "bg-orange-50 text-orange-700 border border-orange-200",
  // Onboarding sub-stages
  "OB To Be Scheduled": "bg-gray-50 text-gray-600 border border-gray-200",
  "In Implementation":  "bg-indigo-50 text-indigo-700 border border-indigo-200",
  "Under Review":       "bg-purple-50 text-purple-700 border border-purple-200",
  "Client Unresponsive":"bg-red-50 text-red-600 border border-red-200",
  "CSM Handover Pending":"bg-amber-50 text-amber-700 border border-amber-200",
  "OB Live":            "bg-green-50 text-green-700 border border-green-200",
  // Churned sub-stages
  "Sales Drop off":     "bg-red-50 text-red-600 border border-red-200",
  "OB Drop off":        "bg-orange-50 text-orange-700 border border-orange-200",
  "Drop off":           "bg-red-50 text-red-700 border border-red-200",
}

function SubStageBadge({ subStage }: { subStage?: string }) {
  if (!subStage) return <span className="text-sm text-gray-300">—</span>
  const style = SUB_STAGE_BADGE_STYLES[subStage] ?? "bg-gray-50 text-gray-600 border border-gray-200"
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[8px] text-xs font-medium whitespace-nowrap ${style}`}>
      {subStage}
    </span>
  )
}

function RetentionPill({ value }: { value: number | null }) {
  if (value === null) return <span className="text-sm text-gray-300">—</span>
  const isGood = value >= 100
  return (
    <span className={`text-sm font-medium ${isGood ? "text-green-600" : "text-red-500"}`}>
      {value.toFixed(1)}%
    </span>
  )
}

function isChurned(stages: StageSegment[]): boolean {
  if (!stages.length) return false
  const dominant = stages.reduce((a, b) => (b.count > a.count ? b : a), stages[0])
  return dominant.color === STAGE_COLORS.churned
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      {open
        ? <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        : <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      }
    </svg>
  )
}

function SubProductSubRow({ sub }: { sub: SubProductRow }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-gray-50/60 bg-gray-50/30">
      <td className="px-4 py-1.5 pl-36 sticky left-0 z-10 bg-white shadow-[inset_-1px_0_0_0_#e5e7eb]">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
          <span className="text-xs text-gray-500 font-light">{sub.name}</span>
        </div>
      </td>
      <td className="px-4 py-1.5 text-left border-r border-gray-200">
        <StageBadge segments={sub.stages} />
      </td>
      <td className="px-4 py-1.5 text-left border-r border-gray-200">
        <SubStageBadge subStage={sub.subStage} />
      </td>
      <td className="px-4 py-1.5 text-right border-r border-gray-200">
        <div className={`text-xs font-light ${isChurned(sub.stages) ? "line-through text-gray-400" : "text-gray-600"}`}>{sub.carr}</div>
      </td>
      <td className="px-4 py-1.5 text-right border-r border-gray-200">
        <div className="text-xs text-gray-600 font-light">{sub.larr || "—"}</div>
      </td>
      <td className="px-4 py-1.5 text-right border-r border-gray-200">
        <RetentionPill value={sub.grr} />
      </td>
      <td className="px-4 py-1.5 text-right">
        <RetentionPill value={sub.nrr} />
      </td>
    </tr>
  )
}

function ProductSubRow({ product }: { product: ProductRow }) {
  const [expanded, setExpanded] = useState(false)
  const hasSubProducts = product.subProducts && product.subProducts.length > 0
  return (
    <>
      <tr
        className={`border-b border-gray-100 hover:bg-gray-50 ${hasSubProducts ? "cursor-pointer" : ""}`}
        onClick={hasSubProducts ? () => setExpanded(!expanded) : undefined}
      >
        <td className="px-4 py-1.5 pl-24 sticky left-0 z-10 bg-white shadow-[inset_-1px_0_0_0_#e5e7eb]">
          <div className="flex items-center gap-2">
            {hasSubProducts ? (
              <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0">
                <ChevronIcon open={expanded} />
              </button>
            ) : (
              <div className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm text-gray-700 font-light">{product.name}</span>
            <span className="text-xs text-gray-400 font-light">{product.planCount}p</span>
            <PlanBadge plan={product.plan} />
          </div>
        </td>
        <td className="px-4 py-1.5 text-left border-r border-gray-200">
          <StageBadge segments={product.stages} />
        </td>
        <td className="px-4 py-1.5 text-left border-r border-gray-200">
          <SubStageBadge subStage={product.subStage} />
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <div className={`text-sm font-light ${isChurned(product.stages) ? "line-through text-gray-400" : "text-gray-800"}`}>{product.carr}</div>
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <div className="text-sm text-gray-800 font-light">{product.larr || "—"}</div>
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <RetentionPill value={product.grr} />
        </td>
        <td className="px-4 py-1.5 text-right">
          <RetentionPill value={product.nrr} />
        </td>
      </tr>
      {expanded && product.subProducts?.map((sub) => <SubProductSubRow key={sub.id} sub={sub} />)}
    </>
  )
}

function RooftopSubRow({ rooftop }: { rooftop: RooftopRow }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <tr className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-1.5 pl-14 sticky left-0 z-10 bg-white shadow-[inset_-1px_0_0_0_#e5e7eb]">
          <div className="flex items-center gap-2">
            <button className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600">
              <ChevronIcon open={expanded} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-800 font-normal truncate">{rooftop.name}</span>
                {rooftop.type && (
                  <span className={`flex-shrink-0 inline-flex px-3 py-0.5 text-xs font-semibold border items-center rounded-[8px] ${
                    rooftop.type === "Independent"
                      ? "bg-[#EEFCD5] text-[#3B6E23] border-[#BFEDA0]"
                      : "bg-[#FEF8E1] text-[#7C4F1A] border-[#F0D98A]"
                  }`}>
                    {rooftop.type}
                  </span>
                )}
              </div>
              {rooftop.products.length > 0 && (
                <div className="flex items-center gap-2 mt-0.5">
                  {rooftop.products.map((p) => (
                    <span key={p.id} className="text-xs text-gray-500 font-light">
                      {p.name} ×{p.planCount}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-1.5 text-left border-r border-gray-200">
          <StageBadge segments={rooftop.stages} />
        </td>
        <td className="px-4 py-1.5 text-left border-r border-gray-200">
          <SubStageBadge subStage={rooftop.subStage} />
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <div className={`text-sm font-light ${isChurned(rooftop.stages) ? "line-through text-gray-400" : "text-gray-800"}`}>{rooftop.carr}</div>
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <div className="text-sm text-gray-800 font-light">{rooftop.larr}</div>
        </td>
        <td className="px-4 py-1.5 text-right border-r border-gray-200">
          <RetentionPill value={rooftop.grr} />
        </td>
        <td className="px-4 py-1.5 text-right">
          <RetentionPill value={rooftop.nrr} />
        </td>
      </tr>
      {expanded && rooftop.products.map((p) => <ProductSubRow key={p.id} product={p} />)}
    </>
  )
}

function EnterpriseTableRow({ enterprise }: { enterprise: EnterpriseRow }) {
  const [expanded, setExpanded] = useState(false)
  const filteredCarr = formatAmount(enterprise.rooftops.reduce((s, r) => s + parseAmount(r.carr), 0))
  const filteredLarr = formatAmount(enterprise.rooftops.reduce((s, r) => s + parseAmount(r.larr), 0))
  const filteredCarrChurned = enterprise.rooftops.length > 0 && enterprise.rooftops.every(r => isChurned(r.stages))
  return (
    <>
      <tr className="cursor-pointer hover:bg-gray-50 border-b border-gray-100" onClick={() => setExpanded(!expanded)}>
        <td className="px-4 py-2 sticky left-0 z-10 bg-white shadow-[inset_-1px_0_0_0_#e5e7eb]">
          <div className="flex items-center gap-3">
            <button className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0">
              <ChevronIcon open={expanded} />
            </button>
            <div>
              <span className="text-sm font-medium text-gray-900">{enterprise.name}</span>
            </div>
          </div>
        </td>
        <td className="px-4 py-2 text-left border-r border-gray-200">
          <StageBadge segments={enterprise.stages} />
        </td>
        <td className="px-4 py-2 text-left border-r border-gray-200">
          <SubStageBadge subStage={enterprise.subStage} />
        </td>
        <td className="px-4 py-2 text-right border-r border-gray-200">
          <div className={`text-sm font-medium ${(isChurned(enterprise.stages) || filteredCarrChurned) ? "line-through text-gray-400" : "text-gray-900"}`}>{filteredCarr}</div>
        </td>
        <td className="px-4 py-2 text-right border-r border-gray-200">
          <div className={`text-sm font-medium ${(isChurned(enterprise.stages) || filteredCarrChurned) ? "line-through text-gray-400" : "text-gray-900"}`}>{filteredLarr}</div>
        </td>
        <td className="px-4 py-2 text-right border-r border-gray-200">
          <RetentionPill value={enterprise.grr} />
        </td>
        <td className="px-4 py-2 text-right">
          <RetentionPill value={enterprise.nrr} />
        </td>
      </tr>
      {expanded && enterprise.rooftops.map((r) => <RooftopSubRow key={r.id} rooftop={r} />)}
    </>
  )
}

export type RooftopsData = Record<string, unknown>

const TYPE_TAG_MAP: Record<string, string> = {
  GROUP_DEALER: "Group Dealer",
  INDIVIDUAL_DEALER: "Individual Dealer",
  FRANCHISE_DEALER: "Franchise Dealer",
  INDEPENDENT_DEALER: "Independent Dealer",
  PARTNER: "Partner",
  CAR_RENTAL_LEASING: "Car Rental Leasing",
}

const STAGE_COLOR_MAP: Record<string, string> = {
  Live: STAGE_COLORS.live,
  Contracted: STAGE_COLORS.contracted,
  Onboarding: STAGE_COLORS.onboarding,
  Churned: STAGE_COLORS.churned,
  "Contract-Initiated": STAGE_COLORS.contracted,
  "Drop-Off": STAGE_COLORS.churned,
}

function dominantStageColor(stages: StageSegment[]): string | null {
  if (!stages.length) return null
  return stages.reduce((a, b) => (b.count > a.count ? b : a)).color
}

const COLOR_STAGE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(STAGE_COLOR_MAP).map(([k, v]) => [v, k])
)

function getStageNameFromColor(color: string | undefined): string {
  return color ? (COLOR_STAGE_MAP[color] ?? "") : ""
}

function parseAmount(str: string): number {
  const s = (str ?? "").replace(/[$$,\s]/g, "")
  if (s.endsWith("M")) return parseFloat(s) * 1_000_000
  if (s.endsWith("K")) return parseFloat(s) * 1_000
  return parseFloat(s) || 0
}

function formatAmount(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`
  return `$${n}`
}

const TAB_PRODUCT_MAP: Record<string, string> = {
  studio_ai: "Studio AI",
  vini_ai: "Vini AI",
}

export function OnboardingTable({ activeTab = "all" }: { activeTab?: "all" | "studio_ai" | "vini_ai" }) {
  const [overviewPeriod, setOverviewPeriod] = useState<'mtd' | 'qtd' | 'custom'>('mtd')
  const [overviewTab, setOverviewTab] = useState<'Overview' | 'Stages'>('Overview')
  const [overviewAgentFilter, setOverviewAgentFilter] = useState<string>('All Agents')
  const [overviewAgentDropdownOpen, setOverviewAgentDropdownOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [planFilter, setPlanFilter] = useState("All")
  const [studioPlanFilter, setStudioPlanFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [subTypeFilter, setSubTypeFilter] = useState<string[]>([])
  const [productFilter, setProductFilter] = useState<string[]>([])
  const [stageFilter, setStageFilter] = useState<string[]>([])
  const [subStageFilter, setSubStageFilter] = useState<string[]>([])
  const [rooftopTypeFilter, setRooftopTypeFilter] = useState<string[]>([])
  const [regionFilter, setRegionFilter] = useState<string[]>([])
  const [liveArrFilter, setLiveArrFilter] = useState<{ operator: string; amount: number | number[] }[]>([])
  const [contractedArrFilter, setContractedArrFilter] = useState<{ operator: string; amount: number | number[] }[]>([])
  const [healthScoreFilter, setHealthScoreFilter] = useState<{ min: number; max: number }[]>([])
  const [accountType, setAccountType] = useState<'live' | 'test'>('live')
  const [atRiskActive, setAtRiskActive] = useState(false)
  const [mediaFilter, setMediaFilter] = useState<string[]>([])
  const [agentFilter, setAgentFilter] = useState<string[]>([])
  const [dealerSegmentFilter, setDealerSegmentFilter] = useState<string[]>([])
  const [period, setPeriod] = useState<{ type: 'mtd' | 'qtd' | 'custom'; startDate?: string; endDate?: string }>({ type: 'mtd' })

  // baseData applies all filters except the tab filter — used for widget totals
  const baseData = useMemo(() => {
    return enterpriseData
      .filter(ent =>
        typeFilter.length === 0 || typeFilter.some(t => ent.tags === (TYPE_TAG_MAP[t] ?? t))
      )
      .filter(ent =>
        dealerSegmentFilter.length === 0 || dealerSegmentFilter.includes(ent.dealerSegment ?? "")
      )
      .map(ent => {
        let rooftops = ent.rooftops
        if (rooftopTypeFilter.length > 0) {
          rooftops = rooftops.filter(r => rooftopTypeFilter.includes(r.type.toLowerCase()))
        }
        if (stageFilter.length > 0 || subStageFilter.length > 0) {
          rooftops = rooftops.filter(r => {
            const dc = dominantStageColor(r.stages)
            const stageName = getStageNameFromColor(dc ?? undefined)
            // Sub stages selected for this parent — match by subStage value
            const subStagesForParent = SUB_STAGE_MAP[stageName] ?? []
            const hasSubStageSelectionForParent = subStagesForParent.some(ss => subStageFilter.includes(ss))
            if (stageFilter.includes(stageName) && !hasSubStageSelectionForParent) return true
            if (subStageFilter.includes(r.subStage ?? "")) return true
            return false
          })
        }
        if (atRiskActive) {
          rooftops = rooftops.filter(r => r.grr !== null && r.grr < 100)
        }
        if (studioPlanFilter !== "All") {
          rooftops = rooftops.filter(r =>
            r.products.some((p: ProductRow) => p.name === "Studio AI" && p.plan === studioPlanFilter)
          )
        }
        return { ...ent, rooftops }
      })
      .filter(ent => {
        const hasRooftopFilter = rooftopTypeFilter.length > 0 || stageFilter.length > 0 || subStageFilter.length > 0 || atRiskActive || studioPlanFilter !== "All"
        return !hasRooftopFilter || ent.rooftops.length > 0
      })
  }, [typeFilter, dealerSegmentFilter, rooftopTypeFilter, stageFilter, subStageFilter, atRiskActive, studioPlanFilter])

  // visibleData additionally applies the tab product filter for table rendering
  const visibleData = useMemo(() => {
    if (activeTab === "all") return baseData
    const tabProduct = TAB_PRODUCT_MAP[activeTab]
    return baseData
      .map(ent => ({
        ...ent,
        rooftops: ent.rooftops
          .map(r => ({ ...r, products: r.products.filter((p: ProductRow) => p.name === tabProduct) }))
          .filter(r => r.products.length > 0),
      }))
      .filter(ent => ent.rooftops.length > 0)
  }, [baseData, activeTab])

  const widgetStats = useMemo(() => {
    // Enterprise totals from baseData (no tab filter) — the source of truth
    const entCarr = baseData.reduce((s, e) => s + parseAmount(e.carr), 0)
    const entLarr = baseData.reduce((s, e) => s + parseAmount(e.larr), 0)
    const entCarrDelta = baseData.reduce((s, e) => s + parseAmount(e.carrDelta ?? ""), 0)
    const entLarrDelta = baseData.reduce((s, e) => s + parseAmount(e.larrDelta ?? ""), 0)

    // All products across baseData — denominator for tab ratios
    const baseProducts = baseData.flatMap(e => e.rooftops).flatMap(r => r.products)
    const allProdCarr = baseProducts.reduce((s, p) => s + parseAmount(p.carr), 0)
    const allProdLarr = baseProducts.reduce((s, p) => s + parseAmount(p.larr), 0)
    const allProdCarrDelta = baseProducts.reduce((s, p) => s + parseAmount(p.carrDelta ?? ""), 0)
    const allProdLarrDelta = baseProducts.reduce((s, p) => s + parseAmount(p.larrDelta ?? ""), 0)

    let totalCarr = entCarr
    let totalLarr = entLarr
    let carrDelta = entCarrDelta
    let larrDelta = entLarrDelta

    if (activeTab !== "all" && allProdCarr > 0) {
      // Tab products from visibleData (already filtered to this tab's product)
      const tabProducts = visibleData.flatMap(e => e.rooftops).flatMap(r => r.products)
      const tabProdCarr = tabProducts.reduce((s, p) => s + parseAmount(p.carr), 0)
      const tabProdLarr = tabProducts.reduce((s, p) => s + parseAmount(p.larr), 0)
      const tabProdCarrDelta = tabProducts.reduce((s, p) => s + parseAmount(p.carrDelta ?? ""), 0)
      const tabProdLarrDelta = tabProducts.reduce((s, p) => s + parseAmount(p.larrDelta ?? ""), 0)
      // Scale so Studio AI + Vini AI = All
      totalCarr = (tabProdCarr / allProdCarr) * entCarr
      totalLarr = allProdLarr > 0 ? (tabProdLarr / allProdLarr) * entLarr : 0
      carrDelta = allProdCarrDelta > 0 ? (tabProdCarrDelta / allProdCarrDelta) * entCarrDelta : 0
      larrDelta = allProdLarrDelta > 0 ? (tabProdLarrDelta / allProdLarrDelta) * entLarrDelta : 0
    }
    const baseRooftops = baseData.flatMap(e => e.rooftops)
    const grrRooftops = baseRooftops.filter(r => r.grr !== null)
    const nrrRooftops = baseRooftops.filter(r => r.nrr !== null)
    const avgGrr = grrRooftops.length
      ? grrRooftops.reduce((s, r) => s + r.grr!, 0) / grrRooftops.length
      : null
    const avgNrr = nrrRooftops.length
      ? nrrRooftops.reduce((s, r) => s + r.nrr!, 0) / nrrRooftops.length
      : null
    const enterpriseCount = baseData.length
    const rooftopCount = baseData.reduce((s, e) => s + e.rooftops.length, 0)
    return { totalCarr, totalLarr, carrDelta, larrDelta, avgGrr, avgNrr, enterpriseCount, rooftopCount }
  }, [baseData, visibleData, activeTab])

  const periodLabel = useMemo(() => {
    const now = new Date()
    const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    if (period.type === "custom" && period.startDate && period.endDate) {
      return `${period.startDate} – ${period.endDate}`
    }
    if (period.type === "qtd") {
      const qStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
      return `${fmt(qStart)} – ${fmt(now)}`
    }
    const mStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return `${fmt(mStart)} – ${fmt(now)}`
  }, [period])

  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-2xl overflow-visible">

        {/* Overview Section */}
        <div className="border-b border-gray-200 px-4 pt-3 pb-4">
          {/* Sub-tabs + period toggle */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-end gap-6 border-b border-gray-200 w-fit">
              {(['Overview', 'Stages'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setOverviewTab(tab)}
                  className={`pb-2 text-sm font-medium border-b-2 transition-colors ${
                    overviewTab === tab
                      ? 'border-blue-600 text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {activeTab === 'vini_ai' && (
                <div className="relative">
                  <button
                    onClick={() => setOverviewAgentDropdownOpen(o => !o)}
                    className="flex items-center gap-1.5 px-3 h-8 text-sm font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap"
                  >
                    {overviewAgentFilter}
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {overviewAgentDropdownOpen && (
                    <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1">
                      {['All Agents', 'Service IB', 'Service OB', 'Sales IB', 'Sales OB'].map((option) => (
                        <button
                          key={option}
                          onClick={() => { setOverviewAgentFilter(option); setOverviewAgentDropdownOpen(false) }}
                          className={`w-full text-left px-3 py-1.5 text-sm transition-colors ${
                            overviewAgentFilter === option
                              ? 'bg-blue-50 text-blue-700 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="flex items-center bg-gray-100 rounded-lg p-0.5 h-8">
                {(['mtd', 'qtd', 'custom'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setOverviewPeriod(p)}
                    className={`px-2 sm:px-3 h-7 flex items-center text-xs sm:text-sm font-medium rounded-md transition-colors duration-200 whitespace-nowrap ${
                      overviewPeriod === p
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {p === 'custom' ? 'Custom' : p.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {overviewTab === 'Overview' && (
            <div className="grid grid-cols-4 gap-3">
              {/* New ARR in onboarding */}
              <div className="rounded-xl bg-gray-100 p-1.5 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">New ARR in onboarding</span>
                  <span className="text-2xl font-bold text-green-600">$412.1k</span>
                  <span className="text-xs text-green-600">+8.2% vs last month</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-600 px-2 py-1">
                  <span><span className="font-semibold text-gray-800">42</span> Rooftops</span>
                  <span><span className="font-semibold text-gray-800">25</span> Accounts</span>
                </div>
              </div>

              {/* Moved to Live */}
              <div className="rounded-xl bg-gray-100 p-1.5 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Moved to Live</span>
                  <span className="text-2xl font-bold text-gray-900">$212.3k</span>
                  <span className="text-xs text-green-600">+8.2% vs last month</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-600 px-2 py-1">
                  <span><span className="font-semibold text-gray-800">12</span> Rooftops</span>
                  <span><span className="font-semibold text-gray-800">7</span> Accounts</span>
                </div>
              </div>

              {/* Avg. Days to Handover */}
              <div className="rounded-xl bg-gray-100 p-1.5 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Avg. Days to Handover</span>
                  <span className="text-2xl font-bold text-gray-900">4.1</span>
                  <span className="text-xs text-green-600">-0.1 vs last month</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-600 px-2 py-1">
                  <span><span className="font-semibold text-gray-800">&lt;3</span> Target</span>
                  <span><span className="font-semibold text-red-500">11</span> Rooftops Breached</span>
                </div>
              </div>

              {/* Onboarding Drop Off */}
              <div className="rounded-xl bg-gray-100 p-1.5 flex flex-col gap-1.5">
                <div className="bg-white rounded-lg p-3 flex flex-col gap-1">
                  <span className="text-xs text-gray-500">Onboarding Drop Off</span>
                  <span className="text-2xl font-bold text-red-500">$17.2k</span>
                  <span className="text-xs text-green-600">-3 vs last month</span>
                </div>
                <div className="flex flex-col gap-1 text-xs text-gray-600 px-2 py-1">
                  <span><span className="font-semibold text-red-500">4</span> Rooftops</span>
                  <span><span className="font-semibold text-red-500">3</span> Accounts</span>
                </div>
              </div>
            </div>
          )}

          {overviewTab === 'Stages' && (() => {
            const studioStages = [
              { num: 1, name: 'Pre Onboarding',     count: 24, arr: '$23.1k', unit: 'Rooftops' },
              { num: 2, name: 'Profile setup',      count: 34, arr: '$130k',  unit: 'Rooftops' },
              { num: 3, name: 'Integrations',       count: 13, arr: '$23.1k', unit: 'Rooftops' },
              { num: 4, name: 'Studio & App Setup', count: 37, arr: '$20.2k', unit: 'Rooftops' },
              { num: 5, name: 'Sync & Publish',     count: 56, arr: '$23.1k', unit: 'Rooftops' },
            ]
            const viniStages = [
              { num: 1, name: 'Pre Onboarding',       count: 24, arr: '$23.1k', unit: 'Agents' },
              { num: 2, name: 'Profile & User setup',  count: 34, arr: '$130k',  unit: 'Agent'  },
              { num: 3, name: 'Agent Setup',           count: 37, arr: '$20.2k', unit: 'Agent'  },
              { num: 4, name: 'Integrations',          count: 13, arr: '$23.1k', unit: 'Agent'  },
              { num: 5, name: 'Testing',               count: 13, arr: '$23.1k', unit: 'Agent'  },
              { num: 6, name: 'Deployment',            count: 56, arr: '$23.1k', unit: 'Agent'  },
            ]
            const pipelineStages = activeTab === 'vini_ai' ? viniStages : studioStages
            return (
              <div className="rounded-xl overflow-hidden flex items-stretch">
                {pipelineStages.map((stage, i, stages) => {
                  const isFirst = i === 0
                  const isLast = i === stages.length - 1
                  const a = 18
                  const clipPath = isFirst
                    ? `polygon(0% 0%, calc(100% - ${a}px) 0%, 100% 50%, calc(100% - ${a}px) 100%, 0% 100%)`
                    : isLast
                    ? `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, ${a}px 50%)`
                    : `polygon(0% 0%, calc(100% - ${a}px) 0%, 100% 50%, calc(100% - ${a}px) 100%, 0% 100%, ${a}px 50%)`
                  return (
                    <div
                      key={stage.num}
                      className="flex-1 bg-gray-100 flex flex-col gap-2 py-4"
                      style={{
                        clipPath,
                        marginLeft: i > 0 ? '-8px' : 0,
                        zIndex: stages.length - i,
                        paddingLeft: isFirst ? '16px' : '36px',
                        paddingRight: isLast ? '16px' : '36px',
                      }}
                    >
                      <span className="text-xs font-medium text-purple-600">{stage.num}. {stage.name}</span>
                      <div className="text-sm text-gray-700">
                        <span className="text-2xl font-bold text-gray-900">{stage.count}</span> {stage.unit}
                      </div>
                      <span className="text-sm text-gray-600">{stage.arr} ARR</span>
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>

        <div className="border-b border-gray-200 px-3 py-3">
          <RooftopsTableFilters
            onSearchChange={setSearchValue}
            onPlanChange={setPlanFilter}
            onTypeChange={setTypeFilter}
            onSubTypeChange={setSubTypeFilter}
            onProductChange={setProductFilter}
            onRooftopTypeChange={setRooftopTypeFilter}
            onStageChange={setStageFilter}
            onSubStageChange={setSubStageFilter}
            onLiveArrChange={setLiveArrFilter}
            onContractedArrChange={setContractedArrFilter}
            onHealthScoreChange={setHealthScoreFilter}
            onRegionChange={setRegionFilter}
            onAccountTypeToggle={setAccountType}
            onAtRiskChange={setAtRiskActive}
            onPeriodChange={setPeriod}
            onMediaChange={setMediaFilter}
            onAgentChange={setAgentFilter}
            onDealerSegmentChange={setDealerSegmentFilter}
            onStudioPlanChange={setStudioPlanFilter}
            studioPlanValue={studioPlanFilter}
            activeTab={activeTab}
            mediaValues={mediaFilter}
            agentValues={agentFilter}
            periodValue={period}
            atRiskActive={atRiskActive}
            searchValue={searchValue}
            planValue={planFilter}
            typeValue={typeFilter}
            subTypeValues={subTypeFilter}
            productValues={productFilter}
            stageValues={stageFilter}
            subStageValues={subStageFilter}
            liveArrFilters={liveArrFilter}
            contractedArrFilters={contractedArrFilter}
            healthScoreRanges={healthScoreFilter}
            regionValues={regionFilter}
            accountType={accountType}
          />
        </div>

        <div className="border-b border-gray-200 px-3 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600">
            No of Rooftops:&nbsp;<span className="font-semibold text-blue-600">{widgetStats.rooftopCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600">
            ARR in Onboarding:&nbsp;<span className="font-semibold text-purple-600">{formatAmount(widgetStats.totalCarr)}</span>
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full table-auto border-collapse">
            <RooftopsTableHeader period={periodLabel} />
            <tbody>
              {visibleData.map((enterprise) => (
                <EnterpriseTableRow key={enterprise.id} enterprise={enterprise} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
