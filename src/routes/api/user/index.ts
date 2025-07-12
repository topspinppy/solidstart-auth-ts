import { type APIEvent } from "@solidjs/start/server";
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

  // Here you would typically fetch user information from your database  
  return successResponse("success", { ...safeUserData });
}