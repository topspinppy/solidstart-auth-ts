import { type APIEvent } from "@solidjs/start/server";
import { successResponse, errorResponse } from "~/utils/responses";

// Main handler
export async function POST({ request }: APIEvent) {
  try {
    // Clear the token cookie by setting it to empty and Max-Age to 0
    return successResponse("Logged out successfully", null, {
      headers: {
        "Set-Cookie": "token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict",
      }
    });

  } catch (error) {
    return errorResponse("Internal server error", 500);
  }
}