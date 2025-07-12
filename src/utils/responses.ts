import { json, RouterResponseInit } from "@solidjs/router";


export const errorResponse = (message: string, status: number = 400) => 
  json({ success: false, message }, { status });

export const successResponse = (message: string, data?: unknown, init?: RouterResponseInit ) => 
  json({ success: true, message, data }, init);