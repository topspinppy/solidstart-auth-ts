export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



export const validateRequest = async (request: Request) => {
  const contentType = request.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    return { isValid: false, error: "Content-Type must be application/json" };
  }

  try {
    const body = await request.json();
    if (!body || Object.keys(body).length === 0) {
      return { isValid: false, error: "Request body cannot be empty" };
    }

    if (body.title && typeof body.title !== "string") {
      return { isValid: false, error: "Title must be a string" };
    }
    
    if (body.description && typeof body.description !== "string") {
      return { isValid: false, error: "Description must be a string" };
    }

    return { isValid: true, data: body };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { isValid: false, error: "Invalid JSON format or empty request body" };
    }
    
    return { isValid: false, error: "An unexpected error occurred while processing the request" };
  }

};

export function validateItemInput(
  data: { title?: unknown; description?: unknown },
  opts: { allowPartial?: boolean } = {}
): string | null {
  const { allowPartial = false } = opts;
  const { title, description } = data;

  if (!allowPartial || title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return "Title is required";
    }
  }

  if (description !== undefined && typeof description !== "string") {
    return "Description must be a string";
  }

  // — All checks passed —
  return null;
}
