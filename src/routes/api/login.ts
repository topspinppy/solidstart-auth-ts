import { type APIEvent } from "@solidjs/start/server";
import { adminDB } from "~/lib/firebase-admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateEmail } from "~/utils/validators";
import { errorResponse, successResponse } from "~/utils/responses";

interface LoginRequest {
  email: string;
  password: string;
}

// Main handler
export async function POST({ request }: APIEvent) {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;
    
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

    if (snap.empty) {
      return errorResponse("User not found", 404);
    }

    const userDoc = snap.docs[0];
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(password, userData.passwordHash);

    if (!isPasswordValid) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: userDoc.id, email: userData.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return successResponse("success", token);

  } catch (error) {
    if (error instanceof SyntaxError) {
      return errorResponse("Invalid JSON format");
    }

    return errorResponse("Internal server error", 500);
  }
}