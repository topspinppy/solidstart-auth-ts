import { type APIEvent } from "@solidjs/start/server";
import { adminDB } from "~/lib/firebase-admin";
import { validateAuth } from "~/utils/auth";
import { errorResponse, successResponse } from "~/utils/responses";
import { validateRequest } from "~/utils/validators";

const db = adminDB

export async function GET(event: APIEvent) {
  // Validate user authentication
  const userId = validateAuth(event.request);
  if (!userId) return errorResponse("Unauthorized", 401);

  // Read limit and cursor from query parameters
  const url = new URL(event.request.url);
  const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10), 1);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "10", 10), 1), 100);

  const offset = (page - 1) * limit;


  // 3. สร้าง query
  const snap = await db
    .collection("items")
    .where("ownerId", "==", userId)
    .orderBy("createdAt", "desc")
    .offset(offset)
    .limit(limit)
    .get();
  const snapshot = await db
    .collection("items")
    .where("ownerId", "==", userId).count()
    .get();
  const items = snap.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));

  // 6. ส่งกลับ พร้อม metadata พื้นฐาน
  return successResponse("success", {
    items,
    pagination: {
      page,
      limit,
      total: snapshot.data().count,
      count: items.length,
      hasMore: items.length === limit
    }
  });
}


export async function POST(event: APIEvent) {
  // Validate authentication
  const userId = validateAuth(event.request);
  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  // Validate request
  const validation = await validateRequest(event.request);
  if (!validation.isValid) {
    return errorResponse(validation.error as string, 400);
  }

  // Process request
  const requestData = validation.data;

  const rawItem = {
    ...requestData,
    ownerId: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  const itemRef = await db.collection("items").add(rawItem);
  return successResponse("success", { id: itemRef.id });
}