import { NextRequest, NextResponse } from "next/server";
import { fetchScenesFromAirtable } from "@/lib/airtable";

export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams.get("search") || undefined;
  const maxRecords = parseInt(
    request.nextUrl.searchParams.get("maxRecords") || "100"
  );
  const offset = request.nextUrl.searchParams.get("offset") || undefined;

  try {
    const result = await fetchScenesFromAirtable({
      search,
      maxRecords,
      offset,
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
