import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NOT_IMPLEMENTED = NextResponse.json(
  { error: "Ranking system not yet ported to Postgres" },
  { status: 501 }
);

export async function GET() {
  return NOT_IMPLEMENTED;
}

export async function POST() {
  return NOT_IMPLEMENTED;
}
