import { NextRequest, NextResponse } from "next/server";
import { fetchScenesFromAirtable, StudioLocation } from "@/lib/airtable";

const VALID_LOCATIONS = new Set(["all", "nyc", "la"]);

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || undefined;
  const maxRecords = parseInt(
    request.nextUrl.searchParams.get("maxRecords") || "100"
  );
  const offset = request.nextUrl.searchParams.get("offset") || undefined;
  const locationParam = request.nextUrl.searchParams.get("location") || "all";
  const location = VALID_LOCATIONS.has(locationParam)
    ? (locationParam as StudioLocation)
    : "all";

  try {
    const result = await fetchScenesFromAirtable({
      search,
      maxRecords,
      offset,
      location,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch from Airtable:", error);
    return NextResponse.json(
      { error: "Failed to fetch scenes from Airtable" },
      { status: 500 }
    );
  }
}
