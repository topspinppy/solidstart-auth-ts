import type { APIEvent } from "@solidjs/start/server";
import { FieldPath, FieldValue } from "firebase-admin/firestore";
import { adminDB } from "~/lib/firebase-admin";
import { validateAuth } from "~/utils/auth";
import { errorResponse, successResponse } from "~/utils/responses";
import { validateItemInput } from "~/utils/validators";

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
    return errorResponse("Not found", 404);
  }
  const doc = snap.docs[0];

  return successResponse("success", { id: doc.id, ...doc.data() });
  // Handle the GET request logic here
}


// Handle the PATCH request logic here
export async function PATCH(event: APIEvent) {
  const uid = validateAuth(event.request);
  if (!uid) return errorResponse("Unauthorized", 401);

  const { id } = event.params;
  const data = await event.request.json();

  const err = validateItemInput(data, { allowPartial: true });
  if (err) return errorResponse(err, 400);
    
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
  
  const docRef = snap.docs[0].ref;
    await docRef.update({
      ...data,
      updatedAt: FieldValue.serverTimestamp()
    });

  return successResponse("success", { id: docRef.id, ...data });
}


// Handle the DELETE request logic here
export async function DELETE(event: APIEvent) {
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

  const docRef = snap.docs[0].ref;
  await docRef.delete();

  return successResponse("success", { id: docRef.id });
}