import type { APIEvent } from "@solidjs/start/server";
import { FieldPath } from "firebase-admin/firestore";
import { adminDB } from "~/lib/firebase-admin";
import { validateAuth } from "~/utils/auth";
import { errorResponse, successResponse } from "~/utils/responses";

const db = adminDB


export async function GET(event: APIEvent) {
  const uid = validateAuth(event.request);
  if (!uid) return errorResponse("Unauthorized", 401);

  const { id } = event.params;
  // Query หาฉบับที่ตรงทั้ง id และ ownerId
  const snap = await db
    .collection("items")
    .where(FieldPath.documentId(), "==", id)
    .where("ownerId", "==", uid)
    .limit(1)
    .get();

  if (snap.empty) {
    // ไม่เจอหรือไม่ใช่ของเรา → ตอบ 404
    return errorResponse("Not found", 404);
  }
  const doc = snap.docs[0];

  return successResponse("success", { id: doc.id, ...doc.data() });
  // Handle the GET request logic here
}
