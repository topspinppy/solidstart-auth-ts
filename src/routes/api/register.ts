import { type APIEvent } from "@solidjs/start/server";
import bcrypt from "bcryptjs";
import { adminDB } from "~/lib/firebase-admin";
import { errorResponse, successResponse } from "~/utils/responses";
import { validateEmail } from "~/utils/validators";


export async function POST({ request }: APIEvent) {
  try {
    const { 
      email, 
      password, 
      displayName, 
      avatarUrl, 
      bio 
    } = await request.json();

    // Validation
    if (!email?.trim()) {
      return errorResponse("Email is required");
    }
    if (!password?.trim()) {
      return errorResponse("Password is required");
    }
    if (!validateEmail(email)) {
      return errorResponse("Invalid email format");
    }

    const userRef = adminDB.collection("users");
    const snap = await userRef.where("email", "==", email).limit(1).get();
    if (!snap.empty) {
      return errorResponse("User already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      passwordHash,
      isActive: true,
      displayName: displayName?.trim() ?? "",
      avatarUrl: avatarUrl?.trim() ?? "",
      bio: bio?.trim() ?? "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await userRef.add(newUser);

    return successResponse("User registered successfully");
  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON format");
    }

    return errorResponse("Internal server error", 500);
  }
}