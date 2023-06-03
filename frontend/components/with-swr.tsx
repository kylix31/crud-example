"use client"

import { SWRConfig } from "swr"

import { Company } from "@/app/companies/columns"
import { Supplies } from "@/app/supplies/columns"

interface WithSWRPRops {
  children: React.ReactNode
  data: Company[] | Supplies[]
}

export function WithSWR({ children, data }: WithSWRPRops) {
  return <SWRConfig value={{ fallback: data }}>{children}</SWRConfig>
}
