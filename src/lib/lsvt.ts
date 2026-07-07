// LightspeedVT REST API integration.
// Creates a Location for the customer's company, then a User as the location
// owner with content roles based on tier (Standard vs White-Label).
// Used by both the Stripe webhook (post-payment provisioning) and the trial
// offer endpoint (sales-rep-initiated free trial).

const LSVT_API_BASE_URL = "https://webservices.lightspeedvt.net/REST/V1";
const LSVT_SOURCE_LOCATION_ID = Number(
  process.env.LSVT_SOURCE_LOCATION_ID ?? "233608", // B2B Template Location
);
const LSVT_ACCESS_LEVEL_MANAGER = 4; // Manager/Location Owner per LSVT docs
// LSVT content role bundles per tier (confirmed with the LSVT team):
//   40245, 40246 — Core Library (all 9 department curricula, quizzes, certs)
//   41450        — AI Sales Roleplay module (Standard + White-Label only)
//   41606        — Full Library add-on (Standard + White-Label only)
//   41313        — White-Label branding overlay (White-Label only)
const LSVT_CONTENT_ROLES: Record<LsvtTier, number[]> = {
  essentials: [40245, 40246],
  standard: [40245, 40246, 41450, 41606],
  "white-label": [40245, 40246, 41450, 41313, 41606],
};

export type LsvtTier = "essentials" | "standard" | "white-label";

export type LsvtProvisionResult = {
  locationId: number;
  userId: number;
} | null;

function lsvtAuthHeader(): string | null {
  const username = process.env.LSVT_API_USERNAME;
  const password = process.env.LSVT_API_PASSWORD;
  if (!username || !password) return null;
  return `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
}

async function lsvtCreateLocation(params: {
  name: string;
  phone: string;
}): Promise<number | null> {
  const auth = lsvtAuthHeader();
  if (!auth) {
    console.error("[LSVT] credentials not set — skipping createLocation");
    return null;
  }
  try {
    const res = await fetch(`${LSVT_API_BASE_URL}/locations`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sourceLocationId: LSVT_SOURCE_LOCATION_ID,
        name: params.name.slice(0, 100),
        // Placeholder address values — LSVT validates `state` against a real
        // US state list (rejects free-form like "Not provided") so we pass a
        // valid state code. The owner can update everything from inside LSVT
        // after they log in; we don't collect address at checkout.
        address: "Update in settings",
        city: "Update in settings",
        state: "TX",
        zip: "00000",
        country: "USA",
        phone: params.phone || "0000000000",
        isActive: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[LSVT] createLocation ${res.status}: ${body}`);
      return null;
    }
    const data = await res.json();
    const locationId = data.locationId ?? data.id ?? null;
    return typeof locationId === "number" ? locationId : null;
  } catch (err) {
    console.error("[LSVT] createLocation error:", err);
    return null;
  }
}

async function lsvtCreateUser(params: {
  locationId: number;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  contentRoles: number[];
}): Promise<number | null> {
  const auth = lsvtAuthHeader();
  if (!auth) {
    console.error("[LSVT] credentials not set — skipping createUser");
    return null;
  }
  try {
    const res = await fetch(`${LSVT_API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        locationId: params.locationId,
        username: params.email,
        email: params.email,
        firstName: params.firstName,
        lastName: params.lastName,
        password: params.password,
        accessLevel: LSVT_ACCESS_LEVEL_MANAGER,
        forcePasswordUpdate: true,
        // updateMyProfile must be true so the user actually has permission to
        // change their own password; without it forcePasswordUpdate appears
        // to be silently skipped on first login.
        updateMyProfile: true,
        manageUsers: true,
        contentRole: params.contentRoles,
        isActive: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[LSVT] createUser ${res.status}: ${body}`);
      return null;
    }
    const data = await res.json();
    const userId = data.userId ?? data.id ?? null;
    return typeof userId === "number" ? userId : null;
  } catch (err) {
    console.error("[LSVT] createUser error:", err);
    return null;
  }
}

export async function provisionLightspeedVT(payload: {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  company_name: string;
  product_tier: LsvtTier | "unknown";
}): Promise<LsvtProvisionResult> {
  if (payload.product_tier === "unknown") {
    console.error("[LSVT] cannot provision — product tier unknown");
    return null;
  }
  if (!payload.email || !payload.first_name) {
    console.error("[LSVT] cannot provision — missing email or first name");
    return null;
  }

  const locationName =
    payload.company_name?.trim() ||
    `${payload.first_name} ${payload.last_name}`.trim();

  const locationId = await lsvtCreateLocation({
    name: locationName,
    phone: payload.phone,
  });
  if (!locationId) {
    console.error("[LSVT] location creation failed — aborting user creation");
    return null;
  }
  console.log(`[LSVT] created location ${locationId} (${locationName})`);

  // Static temp password — every new user gets the same initial credentials
  // and is forced to change them on first login (forcePasswordUpdate=true).
  // Previously this was `${firstName}${lastName}123!` but the password lived
  // in two places (LSVT user creation here, GHL credentials email merge
  // fields) and any name-format mismatch between Stripe + GHL caused them
  // to disagree. Static value eliminates that whole class of bug.
  const password = "RealGrit123!";

  const userId = await lsvtCreateUser({
    locationId,
    email: payload.email,
    firstName: payload.first_name,
    lastName: payload.last_name,
    password,
    contentRoles: LSVT_CONTENT_ROLES[payload.product_tier],
  });
  if (!userId) {
    console.error(`[LSVT] user creation failed for location ${locationId}`);
    return null;
  }
  console.log(
    `[LSVT] created user ${userId} (${payload.email}) in location ${locationId}`,
  );
  return { locationId, userId };
}
