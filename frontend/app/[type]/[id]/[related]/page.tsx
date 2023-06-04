import { DataTable } from "@/components/data-table"
import { WithSWR } from "@/components/with-swr"

import { Company, companyColumns } from "../../company-columns"
import { Supply, suppliesColumns } from "../../supplies-columns"

type Type = "companies" | "supplies"

interface DemoPageProps {
  params: { type: Type; id: number; related: Type }
}

async function getData(
  type: Type,
  id: number,
  related: Type
): Promise<Supply[] | Company[]> {
  const res = await fetch(`http://localhost:8080/${type}/${id}/${related}`, {
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data")
  }

  return res.json()
}

export default async function DemoPage({
  params: { type, id, related },
}: DemoPageProps) {
  const data = await getData(type, id, related)

  const isSupplies = type === "supplies"

  const currentFilterName = isSupplies
    ? "Filter by name"
    : "Filter by phantasy name"

  const currentFilterBy = isSupplies ? "name" : "phantasyName"

  return (
    <div className="container mx-auto py-10">
      <WithSWR data={data}>
        <DataTable filterName={currentFilterName} filterBy={currentFilterBy} />
      </WithSWR>
    </div>
  )
}
