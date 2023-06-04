export function backendPath() {
  return (
    process.env.API_BASE ??
    process.env.NEXT_PUBLIC_API_BASE ??
    "http://localhost:8080"
  )

  // return process.env.NODE_ENV === "production"
  //   ? "http://backend:8080"
  //   : "http://localhost:8080"
}
