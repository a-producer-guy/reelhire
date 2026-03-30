// Airtable integration for syncing scene codes
// Fetches scenes from Reelarc's Airtable base and maps them for contractor use

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_SCENES_TABLE_ID = process.env.AIRTABLE_SCENES_TABLE_ID;
const AIRTABLE_SCENES_VIEW_ID = process.env.AIRTABLE_SCENES_VIEW_ID;
const AIRTABLE_NYC_VIEW_ID = process.env.AIRTABLE_NYC_VIEW_ID;
const AIRTABLE_LA_VIEW_ID = process.env.AIRTABLE_LA_VIEW_ID;

export type StudioLocation = "all" | "nyc" | "la";

const VIEW_IDS: Record<StudioLocation, string | undefined> = {
  all: AIRTABLE_SCENES_VIEW_ID,
  nyc: AIRTABLE_NYC_VIEW_ID,
  la: AIRTABLE_LA_VIEW_ID,
};

const AIRTABLE_API_URL = "https://api.airtable.com/v0";

export type AirtableScene = {
  airtableId: string;
  sceneCode: string;
  description: string;
  actorName: string;
  shootDate: string | null;
  status: string | null;
  genre: string | null;
  director: string | null;
  notes: string | null;
  rawFields: Record<string, unknown>;
};

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
};

type AirtableResponse = {
  records: AirtableRecord[];
  offset?: string;
};

// Map Airtable field names to our scene model
// This handles common naming variations in Airtable columns
function findField(fields: Record<string, unknown>, candidates: string[]): unknown {
  for (const candidate of candidates) {
    // Check exact match first
    if (fields[candidate] !== undefined) return fields[candidate];
    // Check case-insensitive
    const key = Object.keys(fields).find(
      (k) => k.toLowerCase() === candidate.toLowerCase()
    );
    if (key) return fields[key];
  }
  return null;
}

function mapRecordToScene(record: AirtableRecord): AirtableScene {
  const f = record.fields;

  // Try common field name patterns for each attribute
  const sceneCode = findField(f, [
    "Scene Code", "Scene", "Code", "Scene #", "Scene Number",
    "scene_code", "SceneCode", "Name", "Scene ID",
  ]) as string || `AT-${record.id.slice(-6)}`;

  const actorName = findField(f, [
    "Actor", "Actor Name", "Talent", "Talent Name", "Client",
    "Client Name", "actor_name", "ActorName", "Name",
    "First Name", "Actor First Name",
  ]) as string || "";

  const description = findField(f, [
    "Description", "Scene Description", "Desc", "Details",
    "Notes", "Scene Details", "Title", "Scene Title",
    "Logline", "Synopsis",
  ]) as string || "";

  const shootDate = findField(f, [
    "Shoot Date", "Date", "Film Date", "Shoot", "Production Date",
    "shoot_date", "ShootDate", "Filming Date",
  ]) as string || null;

  const status = findField(f, [
    "Status", "Scene Status", "Stage", "Phase",
    "Production Status", "Workflow Status",
  ]) as string || null;

  const genre = findField(f, [
    "Genre", "Type", "Scene Type", "Category",
  ]) as string || null;

  const director = findField(f, [
    "Director", "Director Name", "Directed By",
    "DP", "Cinematographer",
  ]) as string || null;

  const notes = findField(f, [
    "Notes", "Comments", "Internal Notes", "Admin Notes",
    "Production Notes",
  ]) as string || null;

  return {
    airtableId: record.id,
    sceneCode: String(sceneCode),
    description: String(description || ""),
    actorName: String(actorName || ""),
    shootDate,
    status: status ? String(status) : null,
    genre: genre ? String(genre) : null,
    director: director ? String(director) : null,
    notes: notes ? String(notes) : null,
    rawFields: f,
  };
}

export async function fetchScenesFromAirtable(options?: {
  search?: string;
  maxRecords?: number;
  offset?: string;
  location?: StudioLocation;
}): Promise<{ scenes: AirtableScene[]; offset?: string; fieldNames: string[] }> {
  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID || !AIRTABLE_SCENES_TABLE_ID) {
    throw new Error("Airtable credentials not configured");
  }

  const params = new URLSearchParams();
  if (options?.maxRecords) params.set("maxRecords", String(options.maxRecords));
  if (options?.offset) params.set("offset", options.offset);
  const viewId = VIEW_IDS[options?.location || "all"] || AIRTABLE_SCENES_VIEW_ID;
  if (viewId) params.set("view", viewId);

  // Add search filter if provided (searches across scene code and actor name fields)
  if (options?.search) {
    const searchTerm = options.search.replace(/'/g, "\\'");
    // Use Airtable's SEARCH formula across multiple fields
    // We search common field names - the OR handles whichever fields exist
    params.set(
      "filterByFormula",
      `OR(
        SEARCH(LOWER("${searchTerm}"), LOWER(ARRAYJOIN(ARRAYCOMPACT(values()), " ")))
      )`
    );
  }

  const url = `${AIRTABLE_API_URL}/${AIRTABLE_BASE_ID}/${AIRTABLE_SCENES_TABLE_ID}?${params}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Airtable API error:", response.status, error);
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data: AirtableResponse = await response.json();

  // Extract field names from first record for debugging/mapping
  const fieldNames = data.records.length > 0
    ? Object.keys(data.records[0].fields)
    : [];

  const scenes = data.records.map(mapRecordToScene);

  return {
    scenes,
    offset: data.offset,
    fieldNames,
  };
}

// Fetch all scenes (handles pagination)
export async function fetchAllScenesFromAirtable(): Promise<AirtableScene[]> {
  const allScenes: AirtableScene[] = [];
  let offset: string | undefined;

  do {
    const result = await fetchScenesFromAirtable({
      maxRecords: 100,
      offset,
    });
    allScenes.push(...result.scenes);
    offset = result.offset;
  } while (offset);

  return allScenes;
}
