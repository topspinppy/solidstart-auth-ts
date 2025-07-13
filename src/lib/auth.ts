// src/lib/auth.ts
import { query, redirect } from "@solidjs/router";
import { getRequestEvent } from "solid-js/web";
import { verifyAuthToken } from "~/utils/auth";

export const requireAuth = query(async () => {
  "use server";
  
  const event = getRequestEvent();
  const request = event?.request;
  
  if (!request) {
    throw redirect("/login");
  }
  
  // เช็ค cookie หรือ session
  const cookies = request.headers.get("cookie") || "";
  const sessionCookie = cookies.split(';')
    .find(c => c.trim().startsWith('token='));
  
  if (!sessionCookie) {
    throw redirect("/login");
  }

  try {
    const token = sessionCookie.split('=')[1];
    const isValid = verifyAuthToken(token);
    if (!isValid) {
      throw redirect("/login");
    }

    return {
      userId: isValid.userId,
      email: isValid.email,
    }
  } catch (error) {
    throw redirect("/login");
  }
}, "auth-check");


export const redirectIfAuthenticated = query(async () => {
  "use server";
  
  const event = getRequestEvent();
  const request = event?.request;
  
  if (!request) {
    return null; 
  }
  
  const cookies = request.headers.get("cookie") || "";
  const sessionCookie = cookies.split(';')
    .find(c => c.trim().startsWith('token='));
  
  if (!sessionCookie) {
    return null; 
  }

  try {
    const token = sessionCookie.split('=')[1];
    const isValid = verifyAuthToken(token);
    if (isValid) {
      throw redirect("/dashboard");
    }
    
    return null;
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    return null;
  }
}, "redirect-if-authenticated");