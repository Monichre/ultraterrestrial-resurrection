import { NextResponse } from "next/server"
import { getLocalIncidents } from "@/lib/local-data"

export const dynamic = "force-dynamic"

export function GET() {
  return NextResponse.json(getLocalIncidents())
}
