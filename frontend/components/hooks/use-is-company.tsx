import * as React from "react"
import { useParams } from "next/navigation"

export function useIsCompany() {
  const params = useParams()

  return React.useMemo(() => params.type === "companies", [params.type])
}
