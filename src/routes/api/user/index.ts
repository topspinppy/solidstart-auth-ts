import { type APIEvent } from "@solidjs/start/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminDB } from "~/lib/firebase-admin";

import { validateAuth } from "~/utils/auth";
import { errorResponse, successResponse } from "~/utils/responses";

const db = adminDB

// get user information all
export async function GET(event: APIEvent) {
  const userId = validateAuth(event.request);
  if (!userId) return errorResponse("Unauthorized", 401);

  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) {
    return errorResponse("User not found", 404);
  }


  const { passwordHash, ...safeUserData } = userDoc.data()!;

  return successResponse("success", { ...safeUserData });
}

// Handle the PATCH request logic here
export async function PATCH(event: APIEvent) {
  const userId = validateAuth(event.request);
  if (!userId) return errorResponse("Unauthorized", 401);

  let updates: Record<string, unknown>;
  try {
    updates = await event.request.json();
  } catch {
    return errorResponse("Invalid JSON payload", 400);
  }

  const allowedFields = ["displayName", "avatarUrl", "bio"];
  const dataToUpdate: Record<string, unknown> = {};

  for (const key of allowedFields) {
    if (key in updates) {
      const val = updates[key];
      if (typeof val !== "string") {
        return errorResponse(`${key} must be a string`, 400);
      }
      dataToUpdate[key] = (val as string).trim();
    }
  }

  if (Object.keys(dataToUpdate).length === 0) {
    return errorResponse("No valid fields to update", 400);
  }

  dataToUpdate.updatedAt = FieldValue.serverTimestamp();

  const userRef = db.collection("users").doc(userId);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    return errorResponse("User not found", 404);
  }

  await userRef.update(dataToUpdate);

  const updatedSnap = await userRef.get();
  const { passwordHash, ...safeData } = updatedSnap.data()!;

  return successResponse("", { user: safeData });
}