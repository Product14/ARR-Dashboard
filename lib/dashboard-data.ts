import type { EnterpriseData } from "@/types/dashboard"

export const initialEnterpriseData: EnterpriseData[] = [
  {
    id: "1",
    enterprise: {
      name: "BMW Lester area",
      logo: "/bmw-logo.png",
      id: "bmw-1",
    },
    status: "Live",
    users: 25,
    arr: 2140000,
    contracted: "12/08/23",
  },
  {
    id: "2",
    enterprise: {
      name: "Mercedes-Benz Pavilion",
      logo: "/mercedes-benz-logo.png",
      id: "mercedes-1",
    },
    status: "Live",
    users: 25,
    arr: 1920000,
    contracted: "12/08/23",
  },
  {
    id: "3",
    enterprise: {
      name: "BMW Experience Center",
      logo: "/bmw-logo.png",
      id: "bmw-2",
    },
    status: "Onboarding",
    users: 25,
    arr: 1560000,
    contracted: "12/08/23",
  },
  {
    id: "4",
    enterprise: {
      name: "Tesla Showroom",
      logo: "/tesla-logo.png",
      id: "tesla-1",
    },
    status: "Contracted",
    users: 25,
    arr: 1340000,
    contracted: "12/08/23",
  },
  {
    id: "5",
    enterprise: {
      name: "Mercedes-Benz Pavilion",
      logo: "/mercedes-benz-logo.png",
      id: "mercedes-2",
    },
    status: "Live",
    users: 25,
    arr: 1180000,
    contracted: "12/08/23",
  },
]
